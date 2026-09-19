package com.airport.staff.service;

import com.airport.staff.dto.StaffRequest;
import com.airport.staff.model.Department;
import com.airport.staff.model.Staff;
import com.airport.staff.repository.DepartmentRepository;
import com.airport.staff.repository.StaffRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StaffService {

    private final StaffRepository staffRepository;
    private final DepartmentRepository departmentRepository;

    public StaffService(
            StaffRepository staffRepository,
            DepartmentRepository departmentRepository) {

        this.staffRepository = staffRepository;
        this.departmentRepository =
                departmentRepository;
    }

    public Staff addStaff(
            StaffRequest request) {

        Department department =
                departmentRepository
                        .findById(
                                request.getDepartmentId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Department not found"
                                )
                        );

        Staff staff = new Staff();

        staff.setEmployeeCode(
                request.getEmployeeCode()
        );

        staff.setName(
                request.getName()
        );

        staff.setDesignation(
                request.getDesignation()
        );

        staff.setPhone(
                request.getPhone()
        );

        staff.setShift(
                request.getShift()
        );

        staff.setAvailabilityStatus(
                "AVAILABLE"
        );

        staff.setDepartment(
                department
        );

        return staffRepository.save(staff);
    }

    public List<Staff> getAllStaff() {

        return staffRepository.findAll();
    }
}