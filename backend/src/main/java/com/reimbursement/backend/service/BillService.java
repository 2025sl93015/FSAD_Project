package com.reimbursement.backend.service;

import com.reimbursement.backend.dto.BillActionRequest;
import com.reimbursement.backend.dto.BillDTO;
import com.reimbursement.backend.dto.CreateBillRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BillService {
    BillDTO createBill(CreateBillRequest request, MultipartFile attachment, String username);
    BillDTO submitBill(Long billId, String username);
    BillDTO getBillById(Long billId, String username);
    List<BillDTO> getMyBills(String username);
    List<BillDTO> getOpenRequestsForUser(String username);
    List<BillDTO> getBillsForManager(String username);
    List<BillDTO> getBillsForFinanceManager(String username);
    List<BillDTO> getAllBills();
    BillDTO approveBillByManager(Long billId, BillActionRequest request, String username);
    BillDTO rejectBillByManager(Long billId, BillActionRequest request, String username);
    BillDTO approveBillByFinance(Long billId, BillActionRequest request, String username);
    BillDTO rejectBillByFinance(Long billId, BillActionRequest request, String username);
    BillDTO closeBill(Long billId, BillActionRequest request, String username);
}
