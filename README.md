
# Wysh Care - Neo-Clinical OS

**Wysh Care** is a production-grade Healthcare Operating System designed to replace legacy EMRs with a unified, patient-owned, and AI-assisted platform. It strictly adheres to India's **ABDM (Ayushman Bharat Digital Mission)** standards for interoperability and data consent.

![Architecture Status](https://img.shields.io/badge/Architecture-Monorepo-blue)
![Compliance](https://img.shields.io/badge/Compliance-ABDM%20%7C%20HIPAA%20%7C%20DPDP-green)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node%20%7C%20Prisma%20%7C%20PostgreSQL-teal)

---

## 🏛 System Architecture

The repository is structured as a Monorepo containing the Frontend Application and the Microservices-ready Backend.

```
wysh-care/
├── apps/frontend (src/)    # Next-gen React Interface (Patient & Doctor Portals)
├── server/                 # Core EMR Backend (Node.js/Express/Prisma)
└── infra/                  # Docker & Deployment Configs
```

### Key Modules

1.  **Core EMR Engine**: Manages Patients, Encounters, Clinical Notes (SOAP), and Prescriptions using a relational PostgreSQL schema.
2.  **Auth & Identity**: Role-based access (RBAC) with JWT and OTP support. Handles **Wysh ID** generation.
3.  **ABDM Adapter**: Implements FHIR R4 mapping, Consent Artefact signing, and encrypted data flow with the National Health Stack.
4.  **AI Service**: Integration with **Google Gemini 2.5** for Clinical Decision Support (CDSS) and Document Extraction (OCR/NER).
5.  **Emergency Layer**: High-availability, read-only public access points for paramedics via QR code.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js v18+
*   PostgreSQL v14+ (or Docker)
*   Google Gemini API Key

### 1. Database Setup
Start a local PostgreSQL instance and configure the connection string in `server/.env`.

```bash
cd server
cp .env.example .env
# Edit DATABASE_URL in .env
```

### 2. Backend Initialization
Install dependencies, push the schema to the DB, and seed initial clinical data.

```bash
cd server
npm install
npx prisma db push
npm run db:seed
npm run dev
```
*The backend runs on http://localhost:3001*

### 3. Frontend Initialization
Launch the React application.

```bash
# In project root
npm install
npm run dev
```
*The frontend runs on http://localhost:3000*

---

## 🔐 Security & Compliance

### 1. Zero Trust Access
*   **Consent Guard**: No doctor can view patient records without an active, time-bound consent or a scheduled appointment.
*   **Audit Trail**: Every read/write action is logged immutably in the `AccessLog` table.

### 2. Data Safety
*   **Encryption**: Sensitive fields (e.g., Emergency Instructions) are encrypted at rest using AES-256.
*   **Soft Deletes**: Clinical records are never hard-deleted to maintain legal history.

### 3. AI Safety
*   **Circuit Breakers**: AI services are wrapped in circuit breakers to prevent cascading failures.
*   **Human-in-the-Loop**: AI outputs (Prescription extraction, Summaries) are marked as `draft` and require doctor approval.

---

## 🩺 Clinical Workflows

### Doctor Console
1.  **Patient Search**: Lookup via Name or Wysh ID.
2.  **Encounter**: Start a visit -> Write SOAP Notes -> Order Labs -> Issue Prescription -> Close Visit.
3.  **Dashboard**: View daily schedule and patient queue.

### Patient Portal
1.  **Timeline**: View longitudinal health history (internal + external ABDM records).
2.  **Documents**: Upload PDF reports for AI analysis.
3.  **Consent Ledger**: Approve/Revoke doctor access.
4.  **Emergency**: Configure emergency contacts and view QR code.

---

## ⚠️ Known Risks & TODOs

1.  **ABDM Sandbox**: The ABDM integration currently points to a mocked Gateway (`server/modules/abdm/gateway.js`). For production, strict ECDH key exchange and signature verification must be enabled in `server/lib/abdm_crypto.js`.
2.  **Video Calls**: Telemedicine links utilize Jitsi Meet public servers. For privacy compliance, a self-hosted Jitsi/Twilio instance is required.
3.  **File Storage**: Document uploads currently use memory/base64 or local temp URLs. Production must use S3/GCS presigned URLs.
4.  **Rate Limiting**: Current limits are generous. Stricter per-IP limits needed for the Emergency endpoint.

---

© 2024 Wysh Group. Built for the Future of Healthcare.
