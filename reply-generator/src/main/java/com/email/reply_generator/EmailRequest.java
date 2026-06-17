package com.email.reply_generator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailRequest {
    private String emailContent;
    private String tone;
    private String length;
    private String language;
    private String customContext;
}
