package com.airport.staff.service;

import com.airport.staff.dto.TaskRequest;
import com.airport.staff.model.Staff;
import com.airport.staff.model.Task;
import com.airport.staff.model.User;
import com.airport.staff.repository.StaffRepository;
import com.airport.staff.repository.TaskRepository;
import com.airport.staff.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final StaffRepository staffRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public TaskService(
            TaskRepository taskRepository,
            StaffRepository staffRepository,
            UserRepository userRepository,
            NotificationService notificationService) {

        this.taskRepository = taskRepository;
        this.staffRepository = staffRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public Task createTask(TaskRequest request, String creatorEmail) {

        User creator = userRepository
                .findByEmail(creatorEmail)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Staff assignedStaff = staffRepository
                .findById(request.getAssignedToStaffId())
                .orElseThrow(() ->
                        new RuntimeException("Staff not found"));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setDeadline(
                LocalDateTime.parse(request.getDeadline()));
        task.setCreatedBy(creator);
        task.setAssignedTo(assignedStaff);
        task.setStatus("PENDING");

        Task savedTask = taskRepository.save(task);

        // Notify the staff member who received this task
        notificationService.send(
                assignedStaff.getUser(),
                "New Task Assigned",
                "You have been assigned a new task: \""
                        + savedTask.getTitle()
                        + "\" with "
                        + savedTask.getPriority()
                        + " priority. Deadline: "
                        + savedTask.getDeadline());

        return savedTask;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getMyTasks(String email) {

        Staff staff = staffRepository
                .findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Staff profile not found"));

        return taskRepository
                .findByAssignedToStaffId(staff.getStaffId());
    }

    public Task updateStatus(Long taskId, String status) {

        Task task = taskRepository
                .findById(taskId)
                .orElseThrow(() ->
                        new RuntimeException("Task not found"));

        task.setStatus(status);
        Task savedTask = taskRepository.save(task);

        // Notify the supervisor who created this task
        notificationService.send(
                savedTask.getCreatedBy(),
                "Task Status Updated",
                "Task \"" + savedTask.getTitle()
                        + "\" has been marked as " + status
                        + " by "
                        + (savedTask.getAssignedTo() != null
                            ? savedTask.getAssignedTo().getName()
                            : "staff"));

        return savedTask;
    }
}