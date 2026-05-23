package com.reimbursement.backend.dto;

import com.reimbursement.backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private String username;
    private String fullName;
    private String email;
    private Role role;
    private Long userId;
}
