package com.airport.staff.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(
            RuntimeException ex) {

        Map<String, Object> body = new HashMap<>();
        body.put("success", false);
        body.put("message", ex.getMessage());

        HttpStatus status =
                ex.getMessage() != null &&
                ex.getMessage().contains("Invalid email or password")
                        ? HttpStatus.UNAUTHORIZED
                        : HttpStatus.BAD_REQUEST;

        return ResponseEntity.status(status).body(body);
    }
}