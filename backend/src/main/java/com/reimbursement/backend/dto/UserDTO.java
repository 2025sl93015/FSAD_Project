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
public class UserDTO {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String department;
    private Role role;
    private Long managerId;
    private String managerName;
    private boolean active;
}
