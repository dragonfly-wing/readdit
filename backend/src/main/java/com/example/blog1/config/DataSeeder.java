package com.example.blog1.config;

import com.example.blog1.model.Post;
import com.example.blog1.model.User;
import com.example.blog1.repository.PostRepository;
import com.example.blog1.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(UserRepository userRepo,
                               PostRepository postRepo,
                               PasswordEncoder encoder) {
        return args -> {

            // 🛑 Only run if DB is empty
            if (userRepo.count() > 0) {
                System.out.println("Seeder skipped: users already exist");
                return;
            }

            System.out.println("🌱 Running Data Seeder...");

            // ─── USERS ─────────────────────────────────────────

            User admin = User.builder()
                    .username("admin")
                    .email("admin@blog.com")
                    .password(encoder.encode("admin123"))
                    .role("MODERATOR")
                    .createdAt(LocalDateTime.now())
                    .build();

            User user = User.builder()
                    .username("testuser")
                    .email("test@blog.com")
                    .password(encoder.encode("123456"))
                    .role("USER")
                    .createdAt(LocalDateTime.now())
                    .build();

            userRepo.saveAll(List.of(admin, user));

            System.out.println("✅ Users seeded");

            // ─── POSTS ─────────────────────────────────────────

            Post post1 = Post.builder()
                    .authorId(user.getId())
                    .authorUsername(user.getUsername())
                    .title("Welcome to the Blog")
                    .content("This is your first seeded post 🚀")
                    .status("published")
                    .tags(List.of("intro", "welcome"))
                    .createdAt(LocalDateTime.now())
                    .publishedAt(LocalDateTime.now())
                    .build();

            Post post2 = Post.builder()
                    .authorId(user.getId())
                    .authorUsername(user.getUsername())
                    .title("Second Post")
                    .content("Now you can test likes, comments, and more.")
                    .status("published")
                    .tags(List.of("test"))
                    .createdAt(LocalDateTime.now())
                    .publishedAt(LocalDateTime.now())
                    .build();

            postRepo.saveAll(List.of(post1, post2));

            System.out.println("✅ Posts seeded");

            System.out.println("🎉 Seeder completed successfully!");
        };
    }
}