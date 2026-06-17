package com.email.reply_generator;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmailReplyRepository extends JpaRepository<EmailReply, Long> {
    List<EmailReply> findAllByOrderByCreatedAtDesc();
}
