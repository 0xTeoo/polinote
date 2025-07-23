# Polinote

**A modern, scalable platform for processing, transcribing, and summarizing YouTube videos, with a full-stack web interface and robust API.**

---

## 1. Project Name & One-liner Description

**Polinote**  
A full-stack platform for ingesting YouTube videos, transcribing audio, generating summaries, and presenting results via a modern web interface.  
**This project is part of my personal portfolio.**

---

## 2. Key Features / Highlights

- **Automated YouTube Video Processing:** Download, transcribe, and summarize videos with a single job
- **Modern Web Interface:** Built with Next.js and Tailwind CSS for a responsive, user-friendly experience
- **Robust API:** RESTful backend using NestJS, supporting job management, results retrieval, and more
- **Scalable Worker Architecture:** BullMQ-based video worker for distributed, reliable processing
- **Type-safe Shared Schemas:** Shared TypeScript types and entities across services
- **Cloud-Ready:** Dockerized, with Redis and database integration
- **Extensible & Testable:** OOP processor chain, clear separation of concerns, and comprehensive testability

---

## 3. Installation & Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Redis
- PostgreSQL
- `yt-dlp` and `ffmpeg` installed on worker hosts
- OpenAI API key
- YouTube API Key

### Manual Local Development

1. **Install dependencies (monorepo):**
   ```bash
   pnpm install
   ```
2. **Start Redis (if not using Docker):**
   ```bash
   docker run -d -p 6379:6379 redis:alpine
   ```
3. **Run services:**
   - API: `pnpm --filter @polinote/api dev`
   - Web: `pnpm --filter @polinote/web dev`
   - Worker: `pnpm --filter @polinote/video-worker dev`

---

## 4. Project Structure

```
polinote/
├── apps/
│   ├── api/           # NestJS backend API
│   └── web/           # Next.js frontend
├── workers/
│   └── video-worker/  # BullMQ-based video processing worker
├── packages/
│   ├── schemas/       # Shared TypeScript schemas
│   └── entities/      # Shared ORM entities
├── docker-compose.yaml
└── ...
```

---

## 5. Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** NestJS, TypeORM, BullMQ, Redis, PostgreSQL
- **Worker:** Node.js, BullMQ, OpenAI API, yt-dlp, ffmpeg
- **Shared:** TypeScript monorepo (pnpm workspaces)
- **Infrastructure:** Docker, Docker Compose, Redis, AWS-ready
---

## 6. Database Schema

![Database ERD](https://private-user-images.githubusercontent.com/76833627/469805701-ed3f0a4b-c40b-4eea-a589-79dc50c2f1e5.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTMyODAxNDIsIm5iZiI6MTc1MzI3OTg0MiwicGF0aCI6Ii83NjgzMzYyNy80Njk4MDU3MDEtZWQzZjBhNGItYzQwYi00ZWVhLWE1ODktNzlkYzUwYzJmMWU1LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA3MjMlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNzIzVDE0MTA0MlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTE3NzAwOTUxZGQxOTlmMDdjYWI1MjZmNDEzYTEzNGZhYTAyZWI1MzVhN2U4Yzc5Y2Q1ZGIzMTY1ODhmN2U3ZmUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.TW8W7xlavgFpIzPQhGRjGzcxPZzATuA78VNWx60Jf-c)

### **Core Entities**
- **Videos:** YouTube video metadata and processing status
- **Transcripts:** Audio transcription data and segments
- **Transcript Segments:** Individual time-stamped transcript segments
- **Summaries:** Generated content summaries and analysis

### **Key Relationships**
- **Videos → Transcripts:** One-to-one relationship for transcription results
- **Transcripts → Transcript Segments:** One-to-many relationship for detailed segments
- **Videos → Summaries:** One-to-many relationship for multiple summary types
---

## 7. Architecture (AWS)

![AWS Architecture Diagram](https://private-user-images.githubusercontent.com/76833627/469801169-27d93b2d-1fe3-47f8-9921-563765b0c46e.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTMyODAwODIsIm5iZiI6MTc1MzI3OTc4MiwicGF0aCI6Ii83NjgzMzYyNy80Njk4MDExNjktMjdkOTNiMmQtMWZlMy00N2Y4LTk5MjEtNTYzNzY1YjBjNDZlLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA3MjMlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNzIzVDE0MDk0MlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWViNDEwYjQzOWNmYjI1N2I0ZWNhMDQ5OTgwZDEwN2E4NDY2MWFlZTFmYWRmYzU4ODA4ZTNhYTQ0NzQ4ODk1YTkmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.vY0zflL8aWgZ_5e7iadxjN_g9_XGiMU9FuZ6SjaDe-M)

**Multi-AZ VPC Setup (10.0.0.0/16):**

### **Core Components**
- **Public Subnets:** Bastion Host (AZ1), VPN Server (AZ2)
- **Private Subnets:** Web/API/Redis (AZ2), RDS (both AZs)
- **External:** On-Premise Worker Server (video processing)

### **Key Features**
- **High Availability:** Multi-AZ deployment with RDS
- **Security:** Private subnets for app services, Bastion for SSH access
- **Hybrid Cloud:** VPN connection to on-premise worker
- **Scalability:** Separated concerns (web/API/database/worker)

---

## 8. License

This project is for demonstration and learning purposes only.  
All rights reserved.

---
