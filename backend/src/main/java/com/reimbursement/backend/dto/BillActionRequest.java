package com.reimbursement.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BillActionRequest {

    @NotBlank(message = "Comment is required")
    private String comment;
}
