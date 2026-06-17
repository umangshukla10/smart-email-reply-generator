# ✉️ AI Email Reply Generator (React + Spring Boot + Gemini API + Docker)
<img width="1440" height="797" alt="Screenshot 2026-06-17 at 12 11 13 PM" src="https://github.com/user-attachments/assets/3a3bc062-47f9-49e8-b210-4cc4fa3756e3" />

An enterprise-ready, AI-powered email assistant that automatically generates tailored, context-aware replies. Users can paste an incoming email, customize the tone, length, and language, provide key reply points, and manage their reply history.

---

## 🚀 Key Features

* **AI-Generated Replies**: Leverages Google Gemini Pro / Flash models to generate intelligent email replies.
* **Customization Filters**:
  * **Tones**: Professional 👔, Casual ☕, Friendly 😊, Urgent 🚨, Apologetic 🙏.
  * **Lengths**: Short (1-2 sentences), Medium (1-2 paragraphs), Long (detailed response).
  * **Languages**: English, Spanish, French, German, Hindi.
* **Smart Prompt Tuning**: Accepts custom key instructions (e.g., "accept the invitation, ask for price") to align the reply.
* **Local Persistence**: Saves generated replies and prompt settings into an H2 database.
* **Saved History Dashboard**: Slide-out history panel to load previous replies back into the form or delete them.
* **Robust Error Handling**: Standardized REST error payloads via `@RestControllerAdvice`.
* **Docker Orchestration**: Simple one-command deployment for both frontend and backend services.

---

## 🛠️ Tech Stack

| Tier | Technology | Description |
|---|---|---|
| **Frontend** | React, Material UI, Axios, Vite | Interactive dark-themed UI |
| **Backend** | Java 21, Spring Boot 3.4.5, Spring Data JPA | Scalable REST API backend |
| **Database** | H2 Database | In-memory persistence for reply logs |
| **HTTP Client** | Spring WebClient | Non-blocking reactive HTTP calls |
| **AI Integration** | Google Gemini API | Natural Language Processing |
| **DevOps** | Docker, Docker Compose | Self-contained, multi-stage containers |

---

## 👤 Developer Details

* **Name**: Umang Shukla
* **Email**: [shuklaumang012@gmail.com](mailto:shuklaumang012@gmail.com)
* **GitHub**: [github.com/umangshukla10](https://github.com/umangshukla10)
