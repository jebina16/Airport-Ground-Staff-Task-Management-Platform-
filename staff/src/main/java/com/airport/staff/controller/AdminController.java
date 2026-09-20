package com.airport.staff.controller;

import com.airport.staff.dto.UserCreateRequest;
import com.airport.staff.model.User;
import com.airport.staff.service.AdminService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(
            AdminService adminService) {

        this.adminService = adminService;
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(
            @RequestBody UserCreateRequest request) {

        return ResponseEntity.ok(
                adminService.createUser(request)
        );
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {

        return ResponseEntity.ok(
                adminService.getAllUsers()
        );
    }
}