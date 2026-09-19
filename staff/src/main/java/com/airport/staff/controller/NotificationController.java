package com.airport.staff.controller;

import com.airport.staff.model.Notification;
import com.airport.staff.service.NotificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(
            Authentication authentication) {

        return ResponseEntity.ok(
                notificationService.getMyNotifications(
                        authentication.getName()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            Authentication authentication) {

        return ResponseEntity.ok(Map.of(
                "count",
                notificationService.getUnreadCount(
                        authentication.getName())));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                notificationService.markAsRead(id));
    }

    @PutMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(
            Authentication authentication) {

        notificationService.markAllAsRead(
                authentication.getName());

        return ResponseEntity.ok(Map.of(
                "message", "All notifications marked as read"));
    }
}