package com.reimbursement.backend.service;

import com.reimbursement.backend.dto.CreateUserRequest;
import com.reimbursement.backend.dto.UserDTO;

import java.util.List;

public interface UserService {
    UserDTO createUser(CreateUserRequest request);
    UserDTO getUserById(Long id);
    UserDTO getUserByUsername(String username);
    List<UserDTO> getAllUsers();
    List<UserDTO> getUsersByRole(String role);
    UserDTO updateUser(Long id, CreateUserRequest request);
    void deactivateUser(Long id);
    List<UserDTO> getManagers();
    List<UserDTO> getFinanceManagers();
}
