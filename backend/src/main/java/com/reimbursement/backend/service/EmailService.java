package com.reimbursement.backend.service;

public interface EmailService {
    void sendBillSubmittedEmail(String toManager, String managerName, String employeeName, String billNumber, String billTitle);
    void sendBillApprovedByManagerEmail(String toEmployee, String employeeName, String billNumber);
    void sendBillRejectedByManagerEmail(String toEmployee, String employeeName, String billNumber, String comment);
    void sendBillSentToFinanceEmail(String toFinance, String financeName, String employeeName, String billNumber);
    void sendBillClosedEmail(String toEmployee, String employeeName, String billNumber, String amount);
    void sendBillRejectedByFinanceEmail(String toEmployee, String employeeName, String billNumber, String comment);
}
