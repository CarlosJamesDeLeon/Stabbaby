package com.stabbaby.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stabbaby.model.SmsReminderStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;

@Service
public class SmsService {
    private static final String PHILSMS_URL = "https://app.philsms.com/api/v3/sms";

    private final HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10)).build();
    private final ObjectMapper json;
    private final String apiToken;
    private final String senderId;

    public SmsService(ObjectMapper json, @Value("${philsms.api.token}") String apiToken,
                      @Value("${philsms.sender.id}") String senderId,
                      @Value("${stabbaby.sms.enabled}") boolean enabled) {
        if (enabled && (apiToken.isBlank() || senderId.isBlank())) {
            throw new IllegalArgumentException("Set PHILSMS_API_TOKEN and PHILSMS_SENDER_ID to enable reminders");
        }
        this.json = json;
        this.apiToken = apiToken;
        this.senderId = senderId;
    }

    public String sendSms(String recipientNumber, String message) throws SmsException {
        if (apiToken.isBlank() || senderId.isBlank()) {
            throw new SmsException(SmsReminderStatus.FAILED, "PhilSMS credentials are missing");
        }

        String phone = recipientNumber.replaceAll("[^0-9]", "");
        if (phone.matches("09[0-9]{9}")) {
            phone = "63" + phone.substring(1);
        } else if (phone.matches("9[0-9]{9}")) {
            phone = "63" + phone;
        }
        if (!phone.matches("639[0-9]{9}")) {
            throw new SmsException(SmsReminderStatus.FAILED, "Invalid Philippine mobile number");
        }

        try {
            String body = json.writeValueAsString(Map.of(
                    "recipient", phone, "sender_id", senderId, "type", "plain", "message", message));
            JsonNode data = readResponse(request("/send")
                    .POST(HttpRequest.BodyPublishers.ofString(body)).build());
            String id = data.path("id").asText();
            if (id.isBlank()) {
                throw new SmsException(SmsReminderStatus.UNKNOWN, "PhilSMS response had no message ID");
            }
            return id;
        } catch (IOException e) {
            throw new SmsException(SmsReminderStatus.UNKNOWN, "Could not verify PhilSMS acceptance");
        }
    }

    public SmsReminderStatus checkDelivery(String messageId) throws SmsException {
        if (!messageId.matches("[A-Za-z0-9_-]+")) {
            throw new SmsException(SmsReminderStatus.UNKNOWN, "Invalid PhilSMS message ID");
        }
        try {
            String status = readResponse(request("/" + messageId).GET().build())
                    .path("status").asText();
            if (status.equalsIgnoreCase("delivered")) {
                return SmsReminderStatus.DELIVERED;
            }
            if (status.equalsIgnoreCase("failed") || status.equalsIgnoreCase("undelivered")
                    || status.equalsIgnoreCase("rejected") || status.equalsIgnoreCase("expired")) {
                return SmsReminderStatus.FAILED;
            }
            return SmsReminderStatus.ACCEPTED;
        } catch (IOException e) {
            throw new SmsException(SmsReminderStatus.UNKNOWN, "Could not read PhilSMS delivery status");
        }
    }

    private HttpRequest.Builder request(String path) {
        return HttpRequest.newBuilder(URI.create(PHILSMS_URL + path))
                .timeout(Duration.ofSeconds(20))
                .header("Authorization", "Bearer " + apiToken)
                .header("Content-Type", "application/json")
                .header("Accept", "application/json");
    }

    private JsonNode readResponse(HttpRequest request) throws IOException, SmsException {
        HttpResponse<String> response;
        try {
            response = client.send(request, HttpResponse.BodyHandlers.ofString());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new SmsException(SmsReminderStatus.UNKNOWN, "PhilSMS request was interrupted");
        }
        int code = response.statusCode();
        if (code == 429) {
            throw new SmsException(SmsReminderStatus.RETRY, "PhilSMS rate limit reached");
        }
        if (code == 400 || code == 401 || code == 403 || code == 422) {
            throw new SmsException(SmsReminderStatus.FAILED, "PhilSMS rejected the request (HTTP " + code + ")");
        }
        if (code < 200 || code >= 300) {
            throw new SmsException(SmsReminderStatus.UNKNOWN, "Unexpected PhilSMS HTTP status " + code);
        }
        JsonNode result = json.readTree(response.body());
        String status = result == null ? "" : result.path("status").asText();
        if (status.equalsIgnoreCase("error")) {
            throw new SmsException(SmsReminderStatus.FAILED, "PhilSMS rejected the request");
        }
        if (!status.equalsIgnoreCase("success")) {
            throw new SmsException(SmsReminderStatus.UNKNOWN, "Unexpected PhilSMS response");
        }
        JsonNode data = result.path("data");
        return data.isArray() && data.size() == 1 ? data.get(0) : data;
    }

    public static class SmsException extends Exception {
        private final SmsReminderStatus status;

        public SmsException(SmsReminderStatus status, String message) {
            super(message);
            this.status = status;
        }

        public SmsReminderStatus getStatus() {
            return status;
        }
    }
}
