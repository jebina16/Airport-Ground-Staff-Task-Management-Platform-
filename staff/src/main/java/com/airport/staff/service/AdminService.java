package com.airport.staff.service;

import com.airport.staff.dto.UserCreateRequest;
import com.airport.staff.model.Department;
import com.airport.staff.model.Role;
import com.airport.staff.model.Staff;
import com.airport.staff.model.User;
import com.airport.staff.repository.DepartmentRepository;
import com.airport.staff.repository.StaffRepository;
import com.airport.staff.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final StaffRepository staffRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    public AdminService(
            UserRepository userRepository,
            StaffRepository staffRepository,
            DepartmentRepository departmentRepository,
            PasswordEncoder passwordEncoder,
            NotificationService notificationService) {

        this.userRepository = userRepository;
        this.staffRepository = staffRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.notificationService = notificationService;
    }

    public User createUser(UserCreateRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        Role role;

        try {
            role = Role.valueOf(
                    request.getRole().trim().toUpperCase());
        } catch (Exception e) {
            throw new RuntimeException("Invalid role");
        }

        // Admin cannot be created from this API
        if (role == Role.ADMIN) {
            throw new RuntimeException(
                    "Admin account cannot be created here");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(email);
        user.setPassword(
                passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        User savedUser = userRepository.save(user);

        // Only STAFF gets a Staff profile
        if (role == Role.STAFF) {

            if (request.getDepartmentId() == null) {
                throw new RuntimeException(
                        "Department is required for staff");
            }

            Department department = departmentRepository
                    .findById(request.getDepartmentId())
                    .orElseThrow(() ->
                            new RuntimeException("Department not found"));

            Staff staff = new Staff();
            staff.setEmployeeCode(request.getEmployeeCode());
            staff.setName(request.getFullName());
            staff.setDesignation(request.getDesignation());
            staff.setPhone(request.getPhone());
            staff.setShift(request.getShift());
            staff.setAvailabilityStatus("AVAILABLE");
            staff.setDepartment(department);
            staff.setUser(savedUser);

            staffRepository.save(staff);
        }

        // Welcome notification for the newly created user
        notificationService.send(
                savedUser,
                "Welcome to AirportOps",
                "Your " + role.name()
                        + " account has been created. "
                        + "You can now log in with your email.");

        return savedUser;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}