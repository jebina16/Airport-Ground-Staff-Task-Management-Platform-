package com.airport.staff.controller;

import com.airport.staff.dto.StatusRequest;
import com.airport.staff.dto.TaskRequest;
import com.airport.staff.model.Task;
import com.airport.staff.service.TaskService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskService taskService;

    public TaskController(
            TaskService taskService) {

        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<Task> createTask(
            @RequestBody TaskRequest request,
            Authentication authentication) {

        String email =
                authentication.getName();

        return ResponseEntity.ok(
                taskService.createTask(
                        request,
                        email
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<Task>> getTasks(
            Authentication authentication) {

        return ResponseEntity.ok(
                taskService.getAllTasks()
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<Task>> getMyTasks(
            Authentication authentication) {

        return ResponseEntity.ok(
                taskService.getMyTasks(
                        authentication.getName()
                )
        );
    }

    @PutMapping("/{taskId}/status")
    public ResponseEntity<Task> updateStatus(
            @PathVariable Long taskId,
            @RequestBody StatusRequest request) {

        return ResponseEntity.ok(
                taskService.updateStatus(
                        taskId,
                        request.getStatus()
                )
        );
    }
}