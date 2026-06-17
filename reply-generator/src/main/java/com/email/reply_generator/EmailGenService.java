package com.email.reply_generator;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class EmailGenService {
    private final WebClient webClient;
    private final EmailReplyRepository emailReplyRepository;

    public EmailGenService(WebClient.Builder webClientBuilder, EmailReplyRepository emailReplyRepository) {
        this.webClient = webClientBuilder.build();
        this.emailReplyRepository = emailReplyRepository;
    }

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String getGeminiApiKey;

    public String generateEmailReply(EmailRequest emailRequest) {
        // Building the prompt
        String prompt = buildPrompt(emailRequest);

        // Crafting a request
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                }
        );

        // Do the request and get the response
        String response = webClient.post()
                .uri(geminiApiUrl + getGeminiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        // Extracting response
        String generatedReply = extractResponseContent(response);

        // Save reply history to database if generation is successful
        if (generatedReply != null && !generatedReply.startsWith("Error processing request:")) {
            EmailReply emailReply = EmailReply.builder()
                    .emailContent(emailRequest.getEmailContent())
                    .tone(emailRequest.getTone())
                    .length(emailRequest.getLength())
                    .language(emailRequest.getLanguage())
                    .customContext(emailRequest.getCustomContext())
                    .generatedReply(generatedReply)
                    .build();
            emailReplyRepository.save(emailReply);
        }

        return generatedReply;
    }

    public List<EmailReply> getReplyHistory() {
        return emailReplyRepository.findAllByOrderByCreatedAtDesc();
    }

    public void deleteReply(Long id) {
        emailReplyRepository.deleteById(id);
    }

    private String extractResponseContent(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        } catch (Exception e) {
            return "Error processing request: " + e.getMessage();
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate an email reply for the following email content. Please do NOT generate a subject line. Only generate the body of the email.");
        
        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            prompt.append(" Use a ").append(emailRequest.getTone()).append(" tone.");
        }
        if (emailRequest.getLength() != null && !emailRequest.getLength().isEmpty()) {
            prompt.append(" Make the reply length ").append(emailRequest.getLength()).append(".");
        }
        if (emailRequest.getLanguage() != null && !emailRequest.getLanguage().isEmpty()) {
            prompt.append(" Write the reply in the ").append(emailRequest.getLanguage()).append(" language.");
        }
        if (emailRequest.getCustomContext() != null && !emailRequest.getCustomContext().isEmpty()) {
            prompt.append(" Ensure the reply addresses these key points/context: ").append(emailRequest.getCustomContext()).append(".");
        }
        
        prompt.append("\nOriginal Email: \n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
}
