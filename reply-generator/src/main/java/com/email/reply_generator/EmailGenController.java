package com.email.reply_generator;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "*")
public class EmailGenController {

    private final EmailGenService emailGenService;

    public EmailGenController(EmailGenService emailGenService) {
        this.emailGenService = emailGenService;
    }

    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest){
        String response=emailGenService.generateEmailReply(emailRequest);
       return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<EmailReply>> getHistory() {
        return ResponseEntity.ok(emailGenService.getReplyHistory());
    }

    @DeleteMapping("/history/{id}")
    public ResponseEntity<Void> deleteReply(@PathVariable Long id) {
        emailGenService.deleteReply(id);
        return ResponseEntity.noContent().build();
    }
}
