# Watchly - Full-Stack Video Streaming App

Free accounts to try with ( username password ):
- nitash 123456
- john 123456
- raja 123456

## Overview
Watchly is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to handle video streaming, user authentication, comments, and real-time interactions. This guide serves as a structured approach to designing full-stack applications with a focus on modularity, scalability, and maintainability.

## 1. Before Writing Code - Planning the Architecture
- **Define Core Features**:
  - User authentication
  - Video upload & playback
  - Comments, likes, subscriptions
- **Identify Key Entities**:
  - Users, videos, comments, likes, subscriptions, tweets
- **Data Flow Between Frontend & Backend**:
  - Frontend sends requests to backend APIs.
  - Backend processes requests, interacts with the database, and sends responses.
  - Frontend updates the UI based on the responses.
- **Choosing the Right Technologies**:
  - **Database**: MongoDB for flexibility in handling media metadata.
  - **Authentication**: JWT for secure access.
  - **Video Hosting**: Cloud storage (Cloudinary) for video and image storage.

## 2. Folder Structure Overview
