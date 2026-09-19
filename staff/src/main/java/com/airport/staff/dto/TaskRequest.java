package com.airport.staff.dto;

public class TaskRequest {

    private String title;
    private String description;
    private String priority;
    private String deadline;
    private Long assignedToStaffId;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

    public Long getAssignedToStaffId() {
        return assignedToStaffId;
    }

    public void setAssignedToStaffId(Long assignedToStaffId) {
        this.assignedToStaffId = assignedToStaffId;
    }
}