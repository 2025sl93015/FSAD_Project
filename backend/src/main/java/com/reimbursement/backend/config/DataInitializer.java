package com.reimbursement.backend.config;

import com.reimbursement.backend.entity.User;
import com.reimbursement.backend.enums.Role;
import com.reimbursement.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create default admin if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("System Administrator")
                    .email("admin@reimbursement.com")
                    .department("IT")
                    .role(Role.ADMIN)
                    .active(true)
                    .build();
            userRepository.save(admin);
            System.out.println("Default admin user created: admin / admin123");
        }

        // Create default finance manager if not exists
        if (!userRepository.existsByUsername("finance")) {
            User fm = User.builder()
                    .username("finance")
                    .password(passwordEncoder.encode("finance123"))
                    .fullName("Finance Manager")
                    .email("finance@reimbursement.com")
                    .department("Finance")
                    .role(Role.FINANCE_MANAGER)
                    .active(true)
                    .build();
            userRepository.save(fm);
            System.out.println("Default finance manager created: finance / finance123");
        }

        // Create default manager if not exists
        if (!userRepository.existsByUsername("manager")) {
            User mgr = User.builder()
                    .username("manager")
                    .password(passwordEncoder.encode("manager123"))
                    .fullName("Default Manager")
                    .email("manager@reimbursement.com")
                    .department("Engineering")
                    .role(Role.MANAGER)
                    .active(true)
                    .build();
            userRepository.save(mgr);
            System.out.println("Default manager created: manager / manager123");
        }

        // Create default employee if not exists
        if (!userRepository.existsByUsername("employee")) {
            User manager = userRepository.findByUsername("manager").orElse(null);
            User emp = User.builder()
                    .username("employee")
                    .password(passwordEncoder.encode("employee123"))
                    .fullName("John Employee")
                    .email("employee@reimbursement.com")
                    .department("Engineering")
                    .role(Role.EMPLOYEE)
                    .manager(manager)
                    .active(true)
                    .build();
            userRepository.save(emp);
            System.out.println("Default employee created: employee / employee123");
        }
    }
}
