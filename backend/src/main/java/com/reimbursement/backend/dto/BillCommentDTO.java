package com.reimbursement.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BillCommentDTO {
    private Long id;
    private Long billId;
    private Long commentedById;
    private String commentedByName;
    private String comment;
    private String action;
    private LocalDateTime createdAt;
}
