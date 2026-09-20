package com.airport.staff.controller;

import com.airport.staff.model.Department;
import com.airport.staff.repository.DepartmentRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentRepository repository;

    public DepartmentController(
            DepartmentRepository repository) {

        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<Department>>
    getDepartments() {

        return ResponseEntity.ok(
                repository.findAll()
        );
    }

    @PostMapping
    public ResponseEntity<Department>
    createDepartment(
            @RequestBody Department department) {

        return ResponseEntity.ok(
                repository.save(department)
        );
    }
}