package com.airport.staff.service;

import com.airport.staff.config.JwtUtil;
import com.airport.staff.dto.AuthRequest;
import com.airport.staff.dto.AuthResponse;
import com.airport.staff.model.User;
import com.airport.staff.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse login(AuthRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );

        boolean passwordMatch =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatch) {
            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getFullName(),
                user.getRole().name()
        );
    }
}
