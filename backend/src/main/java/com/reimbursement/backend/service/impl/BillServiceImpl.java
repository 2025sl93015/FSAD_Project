package com.reimbursement.backend.service.impl;

import com.reimbursement.backend.dto.BillActionRequest;
import com.reimbursement.backend.dto.BillCommentDTO;
import com.reimbursement.backend.dto.BillDTO;
import com.reimbursement.backend.dto.CreateBillRequest;
import com.reimbursement.backend.entity.Bill;
import com.reimbursement.backend.entity.BillComment;
import com.reimbursement.backend.entity.User;
import com.reimbursement.backend.enums.BillStatus;
import com.reimbursement.backend.enums.Role;
import com.reimbursement.backend.exception.ResourceNotFoundException;
import com.reimbursement.backend.repository.BillCommentRepository;
import com.reimbursement.backend.repository.BillRepository;
import com.reimbursement.backend.repository.UserRepository;
import com.reimbursement.backend.service.BillService;
import com.reimbursement.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BillServiceImpl implements BillService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private BillCommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Value("${app.file.upload-dir}")
    private String uploadDir;

    @Override
    public BillDTO createBill(CreateBillRequest request, MultipartFile attachment, String username) {
        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String billNumber = generateBillNumber();
        String attachmentPath = null;

        if (attachment != null && !attachment.isEmpty()) {
            attachmentPath = saveFile(attachment, billNumber);
        }

        User manager = creator.getManager();

        Bill bill = Bill.builder()
                .billNumber(billNumber)
                .title(request.getTitle())
                .description(request.getDescription())
                .billType(request.getBillType())
                .amount(request.getAmount())
                .status(BillStatus.DRAFT)
                .attachmentPath(attachmentPath)
                .createdBy(creator)
                .assignedManager(manager)
                .build();

        return toDTO(billRepository.save(bill));
    }

    @Override
    public BillDTO submitBill(Long billId, String username) {
        Bill bill = getBillEntity(billId);
        User user = getUserEntity(username);

        if (!bill.getCreatedBy().getId().equals(user.getId())) {
            throw new IllegalStateException("Not authorized to submit this bill");
        }
        if (bill.getStatus() != BillStatus.DRAFT) {
            throw new IllegalStateException("Only DRAFT bills can be submitted");
        }
        if (bill.getAssignedManager() == null) {
            throw new IllegalStateException("No manager assigned. Please contact admin.");
        }

        bill.setStatus(BillStatus.SUBMITTED);
        Bill saved = billRepository.save(bill);

        // Send email to manager
        User manager = bill.getAssignedManager();
        emailService.sendBillSubmittedEmail(
                manager.getEmail(), manager.getFullName(),
                user.getFullName(), bill.getBillNumber(), bill.getTitle()
        );

        return toDTO(saved);
    }

    @Override
    public BillDTO getBillById(Long billId, String username) {
        return toDTO(getBillEntity(billId));
    }

    @Override
    public List<BillDTO> getMyBills(String username) {
        User user = getUserEntity(username);
        return billRepository.findByCreatedByIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<BillDTO> getOpenRequestsForUser(String username) {
        User user = getUserEntity(username);
        return billRepository.findByCreatedByIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .filter(b -> b.getStatus() != BillStatus.CLOSED)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<BillDTO> getBillsForManager(String username) {
        User manager = getUserEntity(username);
        return billRepository.findByAssignedManagerIdOrderByCreatedAtDesc(manager.getId())
                .stream()
                .filter(b -> b.getStatus() == BillStatus.SUBMITTED)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<BillDTO> getBillsForFinanceManager(String username) {
        return billRepository.findByStatusOrderByCreatedAtDesc(BillStatus.APPROVED_BY_MANAGER)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<BillDTO> getAllBills() {
        return billRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public BillDTO approveBillByManager(Long billId, BillActionRequest request, String username) {
        Bill bill = getBillEntity(billId);
        User manager = getUserEntity(username);

        if (bill.getStatus() != BillStatus.SUBMITTED) {
            throw new IllegalStateException("Bill is not in SUBMITTED state");
        }

        bill.setStatus(BillStatus.APPROVED_BY_MANAGER);

        // Assign to a finance manager
        List<User> financeManagers = userRepository.findByRole(Role.FINANCE_MANAGER);
        if (!financeManagers.isEmpty()) {
            bill.setFinanceManager(financeManagers.get(0));
        }

        Bill saved = billRepository.save(bill);
        addComment(bill, manager, request.getComment(), "APPROVED_BY_MANAGER");

        // Notify employee
        User employee = bill.getCreatedBy();
        emailService.sendBillApprovedByManagerEmail(
                employee.getEmail(), employee.getFullName(), bill.getBillNumber()
        );

        // Notify finance manager
        if (bill.getFinanceManager() != null) {
            User fm = bill.getFinanceManager();
            emailService.sendBillSentToFinanceEmail(
                    fm.getEmail(), fm.getFullName(), employee.getFullName(), bill.getBillNumber()
            );
        }

        return toDTO(saved);
    }

    @Override
    public BillDTO rejectBillByManager(Long billId, BillActionRequest request, String username) {
        Bill bill = getBillEntity(billId);
        User manager = getUserEntity(username);

        if (bill.getStatus() != BillStatus.SUBMITTED) {
            throw new IllegalStateException("Bill is not in SUBMITTED state");
        }

        bill.setStatus(BillStatus.REJECTED_BY_MANAGER);
        Bill saved = billRepository.save(bill);
        addComment(bill, manager, request.getComment(), "REJECTED_BY_MANAGER");

        User employee = bill.getCreatedBy();
        emailService.sendBillRejectedByManagerEmail(
                employee.getEmail(), employee.getFullName(), bill.getBillNumber(), request.getComment()
        );

        return toDTO(saved);
    }

    @Override
    public BillDTO approveBillByFinance(Long billId, BillActionRequest request, String username) {
        Bill bill = getBillEntity(billId);
        User financeManager = getUserEntity(username);

        if (bill.getStatus() != BillStatus.APPROVED_BY_MANAGER) {
            throw new IllegalStateException("Bill is not approved by manager yet");
        }

        bill.setStatus(BillStatus.APPROVED_BY_FINANCE);
        bill.setFinanceManager(financeManager);
        Bill saved = billRepository.save(bill);
        addComment(bill, financeManager, request.getComment(), "APPROVED_BY_FINANCE");

        return toDTO(saved);
    }

    @Override
    public BillDTO rejectBillByFinance(Long billId, BillActionRequest request, String username) {
        Bill bill = getBillEntity(billId);
        User financeManager = getUserEntity(username);

        if (bill.getStatus() != BillStatus.APPROVED_BY_MANAGER) {
            throw new IllegalStateException("Bill is not in correct state for finance review");
        }

        bill.setStatus(BillStatus.REJECTED_BY_FINANCE);
        bill.setFinanceManager(financeManager);
        Bill saved = billRepository.save(bill);
        addComment(bill, financeManager, request.getComment(), "REJECTED_BY_FINANCE");

        User employee = bill.getCreatedBy();
        emailService.sendBillRejectedByFinanceEmail(
                employee.getEmail(), employee.getFullName(), bill.getBillNumber(), request.getComment()
        );

        return toDTO(saved);
    }

    @Override
    public BillDTO closeBill(Long billId, BillActionRequest request, String username) {
        Bill bill = getBillEntity(billId);
        User financeManager = getUserEntity(username);

        if (bill.getStatus() != BillStatus.APPROVED_BY_FINANCE) {
            throw new IllegalStateException("Bill must be approved by finance before closing");
        }

        bill.setStatus(BillStatus.CLOSED);
        bill.setClosedAt(LocalDateTime.now());
        bill.setFinanceManager(financeManager);
        Bill saved = billRepository.save(bill);
        addComment(bill, financeManager, request.getComment(), "CLOSED");

        User employee = bill.getCreatedBy();
        emailService.sendBillClosedEmail(
                employee.getEmail(), employee.getFullName(),
                bill.getBillNumber(), bill.getAmount().toString()
        );

        return toDTO(saved);
    }

    // ---- Helpers ----

    private Bill getBillEntity(Long id) {
        return billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found: " + id));
    }

    private User getUserEntity(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    private void addComment(Bill bill, User user, String comment, String action) {
        BillComment bc = BillComment.builder()
                .bill(bill)
                .commentedBy(user)
                .comment(comment)
                .action(action)
                .build();
        commentRepository.save(bc);
    }

    private String generateBillNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "BILL-" + timestamp + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }

    private String saveFile(MultipartFile file, String billNumber) {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String filename = billNumber + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);
            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage());
        }
    }

    public BillDTO toDTO(Bill bill) {
        BillDTO dto = new BillDTO();
        dto.setId(bill.getId());
        dto.setBillNumber(bill.getBillNumber());
        dto.setTitle(bill.getTitle());
        dto.setDescription(bill.getDescription());
        dto.setBillType(bill.getBillType());
        dto.setAmount(bill.getAmount());
        dto.setStatus(bill.getStatus());
        dto.setAttachmentPath(bill.getAttachmentPath());
        dto.setCreatedAt(bill.getCreatedAt());
        dto.setUpdatedAt(bill.getUpdatedAt());
        dto.setClosedAt(bill.getClosedAt());

        if (bill.getCreatedBy() != null) {
            dto.setCreatedById(bill.getCreatedBy().getId());
            dto.setCreatedByName(bill.getCreatedBy().getFullName());
            dto.setCreatedByDept(bill.getCreatedBy().getDepartment());
            dto.setCreatedByEmail(bill.getCreatedBy().getEmail());
        }

        if (bill.getAssignedManager() != null) {
            dto.setAssignedManagerId(bill.getAssignedManager().getId());
            dto.setAssignedManagerName(bill.getAssignedManager().getFullName());
            dto.setAssignedManagerEmail(bill.getAssignedManager().getEmail());
        }

        if (bill.getFinanceManager() != null) {
            dto.setFinanceManagerId(bill.getFinanceManager().getId());
            dto.setFinanceManagerName(bill.getFinanceManager().getFullName());
        }

        List<BillCommentDTO> comments = commentRepository.findByBillIdOrderByCreatedAtAsc(bill.getId())
                .stream().map(c -> {
                    BillCommentDTO cd = new BillCommentDTO();
                    cd.setId(c.getId());
                    cd.setBillId(bill.getId());
                    cd.setComment(c.getComment());
                    cd.setAction(c.getAction());
                    cd.setCreatedAt(c.getCreatedAt());
                    if (c.getCommentedBy() != null) {
                        cd.setCommentedById(c.getCommentedBy().getId());
                        cd.setCommentedByName(c.getCommentedBy().getFullName());
                    }
                    return cd;
                }).collect(Collectors.toList());
        dto.setComments(comments);

        return dto;
    }
}
