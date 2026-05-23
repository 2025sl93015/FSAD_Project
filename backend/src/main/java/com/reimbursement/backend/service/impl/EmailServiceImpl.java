package com.reimbursement.backend.service.impl;

import com.reimbursement.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public void sendBillSubmittedEmail(String toManager, String managerName,
                                       String employeeName, String billNumber, String billTitle) {
        String subject = "New Reimbursement Request: " + billNumber;
        String body = "Dear " + managerName + ",\n\n"
                + employeeName + " has submitted a reimbursement request for your approval.\n\n"
                + "Bill Number: " + billNumber + "\n"
                + "Title: " + billTitle + "\n\n"
                + "Please login to the Reimbursement System to review and take action.\n\n"
                + "Regards,\nReimbursement System";
        sendEmail(toManager, subject, body);
    }

    @Override
    public void sendBillApprovedByManagerEmail(String toEmployee, String employeeName, String billNumber) {
        String subject = "Bill Approved by Manager: " + billNumber;
        String body = "Dear " + employeeName + ",\n\n"
                + "Your reimbursement request " + billNumber + " has been approved by your manager "
                + "and is now sent to the Finance team for processing.\n\n"
                + "Regards,\nReimbursement System";
        sendEmail(toEmployee, subject, body);
    }

    @Override
    public void sendBillRejectedByManagerEmail(String toEmployee, String employeeName,
                                               String billNumber, String comment) {
        String subject = "Bill Rejected by Manager: " + billNumber;
        String body = "Dear " + employeeName + ",\n\n"
                + "Your reimbursement request " + billNumber + " has been rejected by your manager.\n\n"
                + "Comment: " + comment + "\n\n"
                + "Please login to the Reimbursement System for more details.\n\n"
                + "Regards,\nReimbursement System";
        sendEmail(toEmployee, subject, body);
    }

    @Override
    public void sendBillSentToFinanceEmail(String toFinance, String financeName,
                                           String employeeName, String billNumber) {
        String subject = "New Reimbursement Pending Finance Approval: " + billNumber;
        String body = "Dear " + financeName + ",\n\n"
                + "A reimbursement request from " + employeeName + " has been approved by the manager "
                + "and is pending your review.\n\n"
                + "Bill Number: " + billNumber + "\n\n"
                + "Please login to the Reimbursement System to take action.\n\n"
                + "Regards,\nReimbursement System";
        sendEmail(toFinance, subject, body);
    }

    @Override
    public void sendBillClosedEmail(String toEmployee, String employeeName,
                                    String billNumber, String amount) {
        String subject = "Reimbursement Processed: " + billNumber;
        String body = "Dear " + employeeName + ",\n\n"
                + "Your reimbursement request " + billNumber + " has been processed and the amount of "
                + amount + " has been credited to your account.\n\n"
                + "Regards,\nReimbursement System";
        sendEmail(toEmployee, subject, body);
    }

    @Override
    public void sendBillRejectedByFinanceEmail(String toEmployee, String employeeName,
                                               String billNumber, String comment) {
        String subject = "Bill Rejected by Finance: " + billNumber;
        String body = "Dear " + employeeName + ",\n\n"
                + "Your reimbursement request " + billNumber + " has been rejected by the Finance team.\n\n"
                + "Comment: " + comment + "\n\n"
                + "Please login to the Reimbursement System for more details.\n\n"
                + "Regards,\nReimbursement System";
        sendEmail(toEmployee, subject, body);
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + to + ": " + e.getMessage());
        }
    }
}
