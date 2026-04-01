package com.example.blog1.repository;

import com.example.blog1.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    // Required for authentication [cite: 22]
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}