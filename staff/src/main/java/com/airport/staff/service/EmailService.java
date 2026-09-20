package com.airport.staff.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Sends real emails over SMTP (Gmail). Runs asynchronously so that
 * a slow or failing mail server never delays or breaks the API
 * response the user is waiting for (e.g. creating a task).
 */
@Service
public class EmailService {

    private static final Logger log =
            LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.notification.email-enabled:true}")
    private boolean emailEnabled;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendEmail(String toAddress, String subject, String body) {

        if (!emailEnabled) {
            log.info("Email sending is disabled (app.notification.email-enabled=false). "
                    + "Skipped email to {}", toAddress);
            return;
        }

        if (toAddress == null || toAddress.isBlank()) {
            log.warn("Skipped email — recipient address is empty");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(toAddress);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);

            log.info("Email sent to {} — subject: {}", toAddress, subject);

        } catch (Exception e) {
            // A failed email must never break task creation or login.
            // Log it and move on — the in-app notification still exists.
            log.error("Failed to send email to {}: {}", toAddress, e.getMessage());
        }
    }
}
