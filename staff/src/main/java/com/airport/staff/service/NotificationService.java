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

    public NotificationService(
            NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    /**
     * Creates and stores a notification for a user.
     * Called automatically when a task is assigned or its status changes.
     */
    public void send(User recipient, String title, String message) {

        if (recipient == null) {
            return;
        }

        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRecipient(recipient);
        notification.setSentDate(LocalDateTime.now());
        notification.setStatus("UNREAD");

        notificationRepository.save(notification);
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