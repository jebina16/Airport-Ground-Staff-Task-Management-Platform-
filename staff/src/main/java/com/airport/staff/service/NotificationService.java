
package com.airport.staff.service;

import com.airport.staff.model.Notification;
import com.airport.staff.model.Role;
import com.airport.staff.model.User;
import com.airport.staff.repository.NotificationRepository;
import com.airport.staff.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository,
            EmailService emailService) {

        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public void send(User recipient, String title, String message) {
        send(recipient, title, message, null);
    }

    public void send(User recipient, String title, String message, Long relatedTaskId) {

        if (recipient == null) {
            return;
        }

        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRecipient(recipient);
        notification.setSentDate(LocalDateTime.now());
        notification.setStatus("UNREAD");
        notification.setRelatedTaskId(relatedTaskId);

        notificationRepository.save(notification);

        String emailBody = "Hi " + recipient.getFullName() + ",\n\n"
                + message
                + "\n\n— Airport Ground Staff Task Management Platform";

        emailService.sendEmail(recipient.getEmail(), title, emailBody);
    }

    /** Notifies every ADMIN account — used when a task is completed. */
    public void notifyAllAdmins(String title, String message, Long relatedTaskId) {

        List<User> admins = userRepository.findByRole(Role.ADMIN);

        for (User admin : admins) {
            send(admin, title, message, relatedTaskId);
        }
    }

    public List<Notification> getMyNotifications(String email) {
        return notificationRepository.findByRecipientEmailOrderBySentDateDesc(email);
    }

    public long getUnreadCount(String email) {
        return notificationRepository.countByRecipientEmailAndStatus(email, "UNREAD");
    }

    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setStatus("READ");
        return notificationRepository.save(notification);
    }

    public void markAllAsRead(String email) {
        List<Notification> list = notificationRepository.findByRecipientEmailOrderBySentDateDesc(email);
        for (Notification n : list) {
            n.setStatus("READ");
        }
        notificationRepository.saveAll(list);
    }
}