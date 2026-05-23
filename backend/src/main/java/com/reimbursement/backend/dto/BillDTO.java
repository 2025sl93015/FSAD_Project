package com.reimbursement.backend.dto;

import com.reimbursement.backend.enums.BillStatus;
import com.reimbursement.backend.enums.BillType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BillDTO {
    private Long id;
    private String billNumber;
    private String title;
    private String description;
    private BillType billType;
    private BigDecimal amount;
    private BillStatus status;
    private String attachmentPath;

    private Long createdById;
    private String createdByName;
    private String createdByDept;
    private String createdByEmail;

    private Long assignedManagerId;
    private String assignedManagerName;
    private String assignedManagerEmail;

    private Long financeManagerId;
    private String financeManagerName;

    private List<BillCommentDTO> comments;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime closedAt;
}
