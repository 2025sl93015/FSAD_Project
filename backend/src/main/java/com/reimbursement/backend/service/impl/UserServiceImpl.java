package com.reimbursement.backend.service.impl;

import com.reimbursement.backend.dto.CreateUserRequest;
import com.reimbursement.backend.dto.UserDTO;
import com.reimbursement.backend.entity.User;
import com.reimbursement.backend.enums.Role;
import com.reimbursement.backend.exception.ResourceNotFoundException;
import com.reimbursement.backend.repository.UserRepository;
import com.reimbursement.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDTO createUser(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + request.getEmail());
        }

        User.UserBuilder builder = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .email(request.getEmail())
                .department(request.getDepartment())
                .role(request.getRole())
                .active(true);

        if (request.getManagerId() != null) {
            User manager = userRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));
            builder.manager(manager);
        }

        User saved = userRepository.save(builder.build());
        return toDTO(saved);
    }

    @Override
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        return toDTO(user);
    }

    @Override
    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return toDTO(user);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<UserDTO> getUsersByRole(String role) {
        return userRepository.findByRole(Role.valueOf(role.toUpperCase()))
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public UserDTO updateUser(Long id, CreateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setDepartment(request.getDepartment());
        user.setRole(request.getRole());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getManagerId() != null) {
            User manager = userRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));
            user.setManager(manager);
        } else {
            user.setManager(null);
        }

        return toDTO(userRepository.save(user));
    }

    @Override
    public void deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        user.setActive(false);
        userRepository.save(user);
    }

    @Override
    public List<UserDTO> getManagers() {
        return userRepository.findByRole(Role.MANAGER).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<UserDTO> getFinanceManagers() {
        return userRepository.findByRole(Role.FINANCE_MANAGER).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setDepartment(user.getDepartment());
        dto.setRole(user.getRole());
        dto.setActive(user.isActive());
        if (user.getManager() != null) {
            dto.setManagerId(user.getManager().getId());
            dto.setManagerName(user.getManager().getFullName());
        }
        return dto;
    }
}
