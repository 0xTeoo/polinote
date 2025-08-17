# 🎯 Polinote  
> **From YouTube to Insights — Automated, AI-powered Video Processing Platform**  
> A production-ready, microservices-based system for ingesting YouTube videos, transcribing audio, and generating AI summaries in real time.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0+-red.svg)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3+-black.svg)](https://nextjs.org/)
[![BullMQ](https://img.shields.io/badge/BullMQ-5.1+-orange.svg)](https://docs.bullmq.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

---

## 🚀 Overview
**Polinote** automates the entire pipeline from YouTube video ingestion to structured, searchable insights.  
It combines **scalable cloud architecture**, **event-driven processing**, and **state-of-the-art AI** to turn hours of content into minutes of actionable information.

---

## 🎯 Key Features & Business Value
- **Automated Content Processing** — Download, transcribe, and summarize with no manual steps.
- **AI-Powered Insights** — OpenAI Whisper for transcription, GPT-5 for summarization.
- **Scalable & Resilient** — BullMQ job queues, multi-AZ AWS deployment.
- **Developer-Friendly** — Type-safe monorepo, shared schemas, comprehensive documentation.
- **Use Cases**:
  - Newsroom automation for instant press briefing summaries.
  - Policy research with searchable, timestamped transcripts.
  - Educational video indexing for fast knowledge retrieval.

---

## 🛠️ Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Frontend** | Next.js + React | 15.3.1 | Modern SSR UI |
| **Backend** | NestJS + TypeORM | 11.0.1 | RESTful API |
| **Worker** | BullMQ + Node.js | 5.1.0 | Async job processing |
| **Database** | PostgreSQL | Latest | Structured storage |
| **Cache/Queue** | Redis | 7.4.2 | Queue + caching |
| **AI** | GPT-5, Whisper-1 | Latest | Summarization & transcription |
| **Media** | yt-dlp + ffmpeg | Latest | Video/audio extraction |
| **Infra** | Docker + Compose | Latest | Container orchestration |

---

## 🏗️ Architecture
![AWS Architecture Diagram](https://private-user-images.githubusercontent.com/76833627/469801169-27d93b2d-1fe3-47f8-9921-563765b0c46e.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTQ4MTcwMTQsIm5iZiI6MTc1NDgxNjcxNCwicGF0aCI6Ii83NjgzMzYyNy80Njk4MDExNjktMjdkOTNiMmQtMWZlMy00N2Y4LTk5MjEtNTYzNzY1YjBjNDZlLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA4MTAlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwODEwVDA5MDUxNFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWJlNTBlYjMwYzdkODI2YjI1OWZhNDIwZTc1YmFjNzgzMzE2ZjZhZTVkZWQ4Mjg5N2FiOWY2OTM5Mzg0NTc4MjgmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.1FnBJ34rowXoTuEDKIUE6Ic40ZqrP_j2UHX6CQkH7og)  
*Multi-AZ AWS architecture with on-premise worker integration.*

**Highlights:**
- **Public Subnets:** Bastion Host, VPN Server
- **Private Subnets:** Web/API/Redis, RDS
- **On-Premise Worker:** Heavy media processing via secure VPN
- **Security:** Bastion SSH access, private RDS, VPC isolation

---

## 🗄️ Database Model
![Database ERD](https://cdn.thepolinote.com/erd.png)  
*Video → Transcript → Segments → Summaries*

- **Videos:** Metadata + processing state
- **Transcripts:** One-to-one with videos
- **Segments:** Time-stamped transcript entries
- **Summaries:** Multiple summary types per video

---

## 📄 License
This project is for **personal portfolio demonstration only**.  
Not licensed for commercial use without permission.

---

<div align="center">

**Built with ❤️ using modern software engineering practices**  
TypeScript • NestJS • Next.js • BullMQ • PostgreSQL • Redis • Docker

</div>
