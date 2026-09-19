package com.airport.staff.controller;

import com.airport.staff.dto.StaffRequest;
import com.airport.staff.model.Staff;
import com.airport.staff.service.StaffService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "http://localhost:5173")
public class StaffController {

    private final StaffService staffService;

    public StaffController(
            StaffService staffService) {

        this.staffService = staffService;
    }

    @PostMapping
    public ResponseEntity<Staff> addStaff(
            @RequestBody StaffRequest request) {

        return ResponseEntity.ok(
                staffService.addStaff(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<Staff>> getAllStaff() {

        return ResponseEntity.ok(
                staffService.getAllStaff()
        );
    }
}