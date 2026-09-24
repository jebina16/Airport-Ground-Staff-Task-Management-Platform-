package com.airport.staff.repository;

import com.airport.staff.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByAssignedToStaffId(Long staffId);

    List<Task> findByAssignedToDepartmentDepartmentId(Long departmentId);
}