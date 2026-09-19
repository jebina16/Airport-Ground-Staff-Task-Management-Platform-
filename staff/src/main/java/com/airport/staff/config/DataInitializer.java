package com.airport.staff.config;

import com.airport.staff.model.Department;
import com.airport.staff.model.Role;
import com.airport.staff.model.User;
import com.airport.staff.repository.DepartmentRepository;
import com.airport.staff.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeData(
            UserRepository userRepository,
            DepartmentRepository departmentRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            // ---------- Default Admin ----------

            String adminEmail = "admin@airport.com";
            String adminPassword = "admin123";

            User admin = userRepository
                    .findByEmail(adminEmail)
                    .orElse(null);

            if (admin == null) {
                admin = new User();
                admin.setEmail(adminEmail);
                admin.setFullName("System Administrator");
                admin.setRole(Role.ADMIN);
            }

            if (!passwordEncoder.matches(
                    adminPassword,
                    admin.getPassword())) {

                admin.setPassword(
                        passwordEncoder.encode(adminPassword));
            }

            userRepository.save(admin);

            System.out.println("======================================");
            System.out.println("Default Admin Account Ready");
            System.out.println("Email    : admin@airport.com");
            System.out.println("Password : admin123");
            System.out.println("======================================");


            // ---------- Default Departments ----------

            if (departmentRepository.count() == 0) {

                departmentRepository.save(
                        newDepartment("Baggage Handling", "Terminal 1"));

                departmentRepository.save(
                        newDepartment("Aircraft Cleaning", "Terminal 1"));

                departmentRepository.save(
                        newDepartment("Refueling Coordination", "Apron Zone A"));

                departmentRepository.save(
                        newDepartment("Passenger Assistance", "Terminal 2"));

                departmentRepository.save(
                        newDepartment("Cargo Handling", "Cargo Terminal"));

                departmentRepository.save(
                        newDepartment("Boarding Support", "Terminal 2"));

                System.out.println(
                        "6 default departments created");
            }
        };
    }

    private Department newDepartment(String name, String location) {

        Department department = new Department();
        department.setDepartmentName(name);
        department.setLocation(location);
        return department;
    }
}