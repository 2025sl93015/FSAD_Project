package com.reimbursement.backend.dto;

import com.reimbursement.backend.enums.BillType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateBillRequest {

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private BillType billType;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal amount;
}
