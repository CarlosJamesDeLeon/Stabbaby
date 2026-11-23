package com.stabbaby.dto;

import jakarta.validation.constraints.NotBlank;

public record CancelRequest(
        @NotBlank(message = "Contact number is required")
        String contactNumber
) {}