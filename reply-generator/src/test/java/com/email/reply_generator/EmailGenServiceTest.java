package com.email.reply_generator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmailGenServiceTest {

    @Mock
    private EmailReplyRepository emailReplyRepository;

    @Mock
    private WebClient.Builder webClientBuilder;

    @Mock
    private WebClient webClient;

    @Mock
    private WebClient.RequestBodyUriSpec requestBodyUriSpec;

    @Mock
    private WebClient.RequestBodySpec requestBodySpec;

    @Mock
    private WebClient.RequestHeadersSpec requestHeadersSpec;

    @Mock
    private WebClient.ResponseSpec responseSpec;

    private EmailGenService emailGenService;

    @BeforeEach
    void setUp() {
        when(webClientBuilder.build()).thenReturn(webClient);
        emailGenService = new EmailGenService(webClientBuilder, emailReplyRepository);
        ReflectionTestUtils.setField(emailGenService, "geminiApiUrl", "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=");
        ReflectionTestUtils.setField(emailGenService, "getGeminiApiKey", "mock-api-key");
    }

    @Test
    void testGenerateEmailReply_Success() {
        // Arrange
        EmailRequest request = new EmailRequest();
        request.setEmailContent("Hello, is the room available?");
        request.setTone("friendly");
        request.setLength("short");
        request.setLanguage("English");
        request.setCustomContext("Say yes and welcome them.");

        String mockApiResponse = "{\n" +
                "  \"candidates\": [{\n" +
                "    \"content\": {\n" +
                "      \"parts\": [{\n" +
                "        \"text\": \"Hi there! Yes, the room is available. We would love to welcome you!\"\n" +
                "      }]\n" +
                "    }\n" +
                "  }]\n" +
                "}";

        when(webClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri(anyString())).thenReturn(requestBodySpec);
        when(requestBodySpec.header(anyString(), anyString())).thenReturn(requestBodySpec);
        when(requestBodySpec.bodyValue(any())).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(String.class)).thenReturn(Mono.just(mockApiResponse));

        when(emailReplyRepository.save(any(EmailReply.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        String result = emailGenService.generateEmailReply(request);

        // Assert
        assertEquals("Hi there! Yes, the room is available. We would love to welcome you!", result);
        verify(emailReplyRepository, times(1)).save(any(EmailReply.class));
    }

    @Test
    void testGetReplyHistory() {
        // Arrange
        EmailReply reply1 = new EmailReply();
        EmailReply reply2 = new EmailReply();
        when(emailReplyRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(reply1, reply2));

        // Act
        List<EmailReply> history = emailGenService.getReplyHistory();

        // Assert
        assertEquals(2, history.size());
        verify(emailReplyRepository, times(1)).findAllByOrderByCreatedAtDesc();
    }

    @Test
    void testDeleteReply() {
        // Act
        emailGenService.deleteReply(1L);

        // Assert
        verify(emailReplyRepository, times(1)).deleteById(1L);
    }
}
