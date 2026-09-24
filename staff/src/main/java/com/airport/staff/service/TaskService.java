
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

        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Staff assignedStaff = staffRepository.findById(request.getAssignedToStaffId())
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setDeadline(LocalDateTime.parse(request.getDeadline()));
        task.setCreatedBy(creator);
        task.setAssignedTo(assignedStaff);
        task.setStatus("PENDING");
        task.setAcknowledged(false);

        Task savedTask = taskRepository.save(task);

        notificationService.send(
                assignedStaff.getUser(),
                "New Task Assigned",
                "You have been assigned a new task: \"" + savedTask.getTitle()
                        + "\" with " + savedTask.getPriority()
                        + " priority. Deadline: " + savedTask.getDeadline(),
                savedTask.getTaskId());

        return savedTask;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task getTaskById(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public List<Task> getMyTasks(String email) {
        Staff staff = staffRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Staff profile not found"));
        return taskRepository.findByAssignedToStaffId(staff.getStaffId());
    }

    /** Tasks belonging to the supervisor's own department. */
    public List<Task> getDepartmentTasks(String supervisorEmail) {

        User supervisor = userRepository.findByEmail(supervisorEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (supervisor.getDepartment() == null) {
            throw new RuntimeException(
                    "This supervisor has no department assigned. Ask an admin to set one.");
        }

        return taskRepository.findByAssignedToDepartmentDepartmentId(
                supervisor.getDepartment().getDepartmentId());
    }

    /** Staff marks their own task as complete. */
    public Task completeTask(Long taskId, String staffEmail) {

        Task task = getTaskById(taskId);

        Staff staff = staffRepository.findByUserEmail(staffEmail)
                .orElseThrow(() -> new RuntimeException("Staff profile not found"));

        if (!task.getAssignedTo().getStaffId().equals(staff.getStaffId())) {
            throw new RuntimeException("You can only complete your own tasks");
        }

        task.setStatus("COMPLETED");
        task.setCompletedAt(LocalDateTime.now());
        task.setAcknowledged(false);

        Task savedTask = taskRepository.save(task);

        String message = staff.getName() + " has completed the task \""
                + savedTask.getTitle() + "\" and is waiting for acknowledgement.";

        // Notify the supervisor who created it
        notificationService.send(
                savedTask.getCreatedBy(),
                "Task Completed — Needs Acknowledgement",
                message,
                savedTask.getTaskId());

        // Notify every admin as well
        notificationService.notifyAllAdmins(
                "Task Completed — Needs Acknowledgement",
                message,
                savedTask.getTaskId());

        return savedTask;
    }

    /** Supervisor/Admin acknowledges a completed task ("OK"). */
    public Task acknowledgeTask(Long taskId) {

        Task task = getTaskById(taskId);

        if (!"COMPLETED".equals(task.getStatus())) {
            throw new RuntimeException("Only completed tasks can be acknowledged");
        }

        task.setAcknowledged(true);
        Task savedTask = taskRepository.save(task);

        if (savedTask.getAssignedTo() != null
                && savedTask.getAssignedTo().getUser() != null) {

            notificationService.send(
                    savedTask.getAssignedTo().getUser(),
                    "Task Acknowledged",
                    "Your completed task \"" + savedTask.getTitle()
                            + "\" has been reviewed and acknowledged. Good work!",
                    savedTask.getTaskId());
        }

        return savedTask;
    }

    /** Supervisor nudges a staff member who hasn't completed their task yet. */
    public void nudgeStaff(Long taskId, String supervisorEmail) {

        Task task = getTaskById(taskId);

        User supervisor = userRepository.findByEmail(supervisorEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (task.getAssignedTo() != null && task.getAssignedTo().getUser() != null) {

            notificationService.send(
                    task.getAssignedTo().getUser(),
                    "Reminder: Task Pending",
                    supervisor.getFullName() + " is checking in on task \""
                            + task.getTitle() + "\" — please update its status.",
                    task.getTaskId());
        }
    }
}