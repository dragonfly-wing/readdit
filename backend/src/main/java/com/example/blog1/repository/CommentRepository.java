package com.example.blog1.repository;

import com.example.blog1.model.Comment;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {

    List<Comment> findByPostIdAndParentCommentIdIsNull(ObjectId postId);

    List<Comment> findByParentCommentId(ObjectId parentCommentId);
}