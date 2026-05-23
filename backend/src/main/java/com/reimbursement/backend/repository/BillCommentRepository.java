package com.reimbursement.backend.repository;

import com.reimbursement.backend.entity.BillComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillCommentRepository extends JpaRepository<BillComment, Long> {
    List<BillComment> findByBillIdOrderByCreatedAtAsc(Long billId);
}
