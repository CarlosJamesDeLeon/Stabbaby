package com.stabbaby.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class SmsService {

    @Value("${philsms.api.token}")
    private String apiToken;

    @Value("${philsms.sender.id}")
    private String senderId;

    private static final String PHILSMS_URL = "https://app.philsms.com/api/v3/sms/send";

    public void sendSms(String recipientNumber, String message) {
        String phone = recipientNumber.trim().replaceAll("[^0-9+]", "");
        if (phone.startsWith("0")) {
            phone = "+63" + phone.substring(1);
        } else if (!phone.startsWith("+")) {
            phone = "+63" + phone;
        }

        String body = String.format(
            "{\"recipient\":\"%s\",\"sender_id\":\"%s\",\"type\":\"plain\",\"message\":\"%s\"}",
            phone, senderId, message.replace("\"", "\\\"")
        );

        try {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(PHILSMS_URL))
                .header("Authorization", "Bearer " + apiToken)
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

            HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
        } catch (Exception e) {
            System.err.println("Failed to send SMS: " + e.getMessage());
        }
    }
}