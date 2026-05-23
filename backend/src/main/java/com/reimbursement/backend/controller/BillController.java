package com.reimbursement.backend.controller;

import com.reimbursement.backend.dto.*;
import com.reimbursement.backend.service.BillService;
import com.reimbursement.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    @Autowired
    private BillService billService;

    @Autowired
    private UserService userService;

    // ---- Employee Endpoints ----

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createBill(
            @RequestPart("bill") @Valid CreateBillRequest request,
            @RequestPart(value = "attachment", required = false) MultipartFile attachment,
            @AuthenticationPrincipal UserDetails userDetails) {
        BillDTO bill = billService.createBill(request, attachment, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(bill, "Bill created successfully"));
    }

    @PostMapping("/{billId}/submit")
    public ResponseEntity<?> submitBill(@PathVariable Long billId,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        BillDTO bill = billService.submitBill(billId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(bill, "Bill submitted successfully"));
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyBills(@AuthenticationPrincipal UserDetails userDetails) {
        List<BillDTO> bills = billService.getMyBills(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(bills, "Bills retrieved"));
    }

    @GetMapping("/my/open")
    public ResponseEntity<?> getOpenRequests(@AuthenticationPrincipal UserDetails userDetails) {
        List<BillDTO> bills = billService.getOpenRequestsForUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(bills, "Open requests retrieved"));
    }

    @GetMapping("/{billId}")
    public ResponseEntity<?> getBillById(@PathVariable Long billId,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        BillDTO bill = billService.getBillById(billId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(bill, "Bill retrieved"));
    }

    // ---- Manager Endpoints ----

    @GetMapping("/manager/pending")
    public ResponseEntity<?> getBillsForManager(@AuthenticationPrincipal UserDetails userDetails) {
        List<BillDTO> bills = billService.getBillsForManager(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(bills, "Bills for manager retrieved"));
    }

    @PostMapping("/{billId}/approve/manager")
    public ResponseEntity<?> approveBillByManager(@PathVariable Long billId,
                                                   @Valid @RequestBody BillActionRequest request,
                                                   @AuthenticationPrincipal UserDetails userDetails) {
        BillDTO bill = billService.approveBillByManager(billId, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(bill, "Bill approved by manager"));
    }

    @PostMapping("/{billId}/reject/manager")
    public ResponseEntity<?> rejectBillByManager(@PathVariable Long billId,
                                                  @Valid @RequestBody BillActionRequest request,
                                                  @AuthenticationPrincipal UserDetails userDetails) {
        BillDTO bill = billService.rejectBillByManager(billId, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(bill, "Bill rejected by manager"));
    }

    // ---- Finance Manager Endpoints ----

    @GetMapping("/finance/pending")
    public ResponseEntity<?> getBillsForFinance(@AuthenticationPrincipal UserDetails userDetails) {
        List<BillDTO> bills = billService.getBillsForFinanceManager(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(bills, "Bills for finance retrieved"));
    }

    @PostMapping("/{billId}/approve/finance")
    public ResponseEntity<?> approveBillByFinance(@PathVariable Long billId,
                                                   @Valid @RequestBody BillActionRequest request,
                                                   @AuthenticationPrincipal UserDetails userDetails) {
        BillDTO bill = billService.approveBillByFinance(billId, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(bill, "Bill approved by finance"));
    }

    @PostMapping("/{billId}/reject/finance")
    public ResponseEntity<?> rejectBillByFinance(@PathVariable Long billId,
                                                  @Valid @RequestBody BillActionRequest request,
                                                  @AuthenticationPrincipal UserDetails userDetails) {
        BillDTO bill = billService.rejectBillByFinance(billId, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(bill, "Bill rejected by finance"));
    }

    @PostMapping("/{billId}/close")
    public ResponseEntity<?> closeBill(@PathVariable Long billId,
                                        @Valid @RequestBody BillActionRequest request,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        BillDTO bill = billService.closeBill(billId, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(bill, "Bill closed successfully"));
    }

    // ---- Admin Endpoint ----

    @GetMapping("/all")
    public ResponseEntity<?> getAllBills(@AuthenticationPrincipal UserDetails userDetails) {
        List<BillDTO> bills = billService.getAllBills();
        return ResponseEntity.ok(ApiResponse.success(bills, "All bills retrieved"));
    }

    // ---- User Profile ----

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        UserDTO user = userService.getUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(user, "Profile retrieved"));
    }

    @GetMapping("/managers")
    public ResponseEntity<?> getManagers() {
        List<UserDTO> managers = userService.getManagers();
        return ResponseEntity.ok(ApiResponse.success(managers, "Managers retrieved"));
    }
}
