package com.airport.staff.service;

import com.airport.staff.model.Notification;
import com.airport.staff.model.User;
import com.airport.staff.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    public NotificationService(
            NotificationRepository notificationRepository,
            EmailService emailService) {

        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
    }

    /**
     * Creates and stores an in-app notification for a user, AND
     * sends a real email to their registered address.
     *
     * Called automatically when:
     *  - an admin creates a new user account
     *  - a supervisor assigns a task
     *  - a staff member updates a task's status
     */
    public void send(User recipient, String title, String message) {

        if (recipient == null) {
            return;
        }

        // 1. Store the in-app notification (always happens, instantly)
        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRecipient(recipient);
        notification.setSentDate(LocalDateTime.now());
        notification.setStatus("UNREAD");

        notificationRepository.save(notification);

        // 2. Send a real email in the background (does not block the request)
        String emailBody = "Hi " + recipient.getFullName() + ",\n\n"
                + message
                + "\n\n— Airport Ground Staff Task Management Platform";

        emailService.sendEmail(
                recipient.getEmail(),
                title,
                emailBody);
    }

    public List<Notification> getMyNotifications(String email) {
        return notificationRepository
                .findByRecipientEmailOrderBySentDateDesc(email);
    }

    public long getUnreadCount(String email) {
        return notificationRepository
                .countByRecipientEmailAndStatus(email, "UNREAD");
    }

    public Notification markAsRead(Long notificationId) {

        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found"));

        notification.setStatus("READ");
        return notificationRepository.save(notification);
    }

    public void markAllAsRead(String email) {

        List<Notification> list = notificationRepository
                .findByRecipientEmailOrderBySentDateDesc(email);

        for (Notification n : list) {
            n.setStatus("READ");
        }

        notificationRepository.saveAll(list);
    }
}
