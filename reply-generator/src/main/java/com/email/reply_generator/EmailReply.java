package com.email.reply_generator;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_replies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailReply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String emailContent;

    private String tone;

    private String length;

    private String language;

    @Column(columnDefinition = "TEXT")
    private String customContext;

    @Column(columnDefinition = "TEXT")
    private String generatedReply;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
