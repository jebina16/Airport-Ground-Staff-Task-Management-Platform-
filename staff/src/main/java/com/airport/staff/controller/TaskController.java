package com.airport.staff.controller;

import com.airport.staff.dto.TaskRequest;
import com.airport.staff.model.Task;
import com.airport.staff.service.TaskService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<Task> createTask(
            @RequestBody TaskRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                taskService.createTask(request, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Task>> getMyTasks(Authentication authentication) {
        return ResponseEntity.ok(taskService.getMyTasks(authentication.getName()));
    }

    @GetMapping("/department")
    public ResponseEntity<List<Task>> getDepartmentTasks(Authentication authentication) {
        return ResponseEntity.ok(taskService.getDepartmentTasks(authentication.getName()));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Task> completeTask(
            @PathVariable Long id,
            Authentication authentication) {

        return ResponseEntity.ok(
                taskService.completeTask(id, authentication.getName()));
    }

    @PutMapping("/{id}/acknowledge")
    public ResponseEntity<Task> acknowledgeTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.acknowledgeTask(id));
    }

    @PutMapping("/{id}/nudge")
    public ResponseEntity<Void> nudgeStaff(
            @PathVariable Long id,
            Authentication authentication) {

        taskService.nudgeStaff(id, authentication.getName());
        return ResponseEntity.ok().build();
    }
}