package com.reimbursement.backend.repository;

import com.reimbursement.backend.entity.Bill;
import com.reimbursement.backend.enums.BillStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByCreatedByIdOrderByCreatedAtDesc(Long userId);
    List<Bill> findByAssignedManagerIdOrderByCreatedAtDesc(Long managerId);
    List<Bill> findByFinanceManagerIdOrderByCreatedAtDesc(Long financeManagerId);
    List<Bill> findByStatusOrderByCreatedAtDesc(BillStatus status);
    List<Bill> findByStatusInOrderByCreatedAtDesc(List<BillStatus> statuses);
    List<Bill> findByCreatedByIdAndStatusOrderByCreatedAtDesc(Long userId, BillStatus status);
    Optional<Bill> findByBillNumber(String billNumber);
    long countByCreatedByIdAndStatus(Long userId, BillStatus status);
}
