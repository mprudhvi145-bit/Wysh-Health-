# Wysh Care - The Future of Healthcare OS

Wysh Care is a next-generation healthcare platform ("Neo-Clinical OS") designed to unify Telemedicine, Electronic Health Records (EHR), and AI-driven medical logistics into a single, futuristic interface.

![Wysh Care Hero](https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop)

## 🌟 Vision

To replace fragmented legacy hospital systems with a cohesive, AI-first operating system that empowers doctors, patients, and administrators.

## 🚀 Key Features

### 1. **Telemedicine 2.0**
*   **Holographic-style UI**: Glassmorphism design language for a futuristic feel.
*   **Instant Booking**: Seamless appointment scheduling with blockchain-grade security simulation.
*   **Doctor Directory**: Advanced filtering by specialty, availability, and rating.

### 2. **AI Health Intelligence**
*   **Wysh AI Assistant**: Powered by Gemini 2.5 Flash, offering real-time medical insights and conversational support.
*   **Predictive Diagnostics**: Visual risk modeling for cardiac, respiratory, and metabolic health.
*   **ECG Analysis**: Client-side simulation of AI-driven arrhythmia detection.

### 3. **Role-Based Dashboards**
*   **Patient Portal**: View upcoming appointments, vitals history, and AI health summaries.
*   **Clinician View**: Manage patient queues, toggle availability status, and review patient records.

### 4. **Immersive Experience**
*   **3D Visualizations**: Interactive DNA helices and holographic organ models using Three.js.
*   **Real-time Vitals**: Simulated WebSocket feeds for heart rate and temperature monitoring.

## 🛠 Tech Stack

*   **Frontend**: React 18, TypeScript, Tailwind CSS
*   **Backend**: Node.js, Express (AI Proxy)
*   **AI Engine**: Google Gemini API (@google/genai)
*   **Visuals**: Three.js, Recharts, Lucide React
*   **Routing**: React Router v6
*   **State Management**: React Context API

## 📦 Project Structure

```
src/
├── components/       # Reusable UI components
├── features/         # Feature-based modules
├── pages/            # Top-level route pages
├── services/         # Frontend services (API, Mock, AI)
server/               # Node.js AI Proxy Server
```

## 🔧 Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/wyshcare/wysh-care-os.git
    cd wysh-care-os
    ```

2.  **Install Frontend dependencies**
    ```bash
    npm install
    ```

3.  **Install Backend dependencies**
    ```bash
    cd server
    npm install
    cd ..
    ```

4.  **Environment Configuration**
    
    Create a `.env` file in the **server/** directory:
    ```env
    API_KEY=your_google_gemini_api_key
    PORT=3001
    CLIENT_URL=http://localhost:3000
    ```

5.  **Run Application**
    
    Terminal 1 (Backend):
    ```bash
    cd server
    npm run dev
    ```

    Terminal 2 (Frontend):
    ```bash
    npm run dev
    ```

## 🚢 Deployment

**Production Build**
```bash
npm run build
```

**Checklist:**
- [x] Environment variables configured
- [x] Error boundaries active
- [x] Backend proxy secured
- [x] Assets optimized

## 🗺 Roadmap

*   **Q3 2024**: Integration with real FHIR servers.
*   **Q4 2024**: Mobile app release (React Native).
*   **Q1 2025**: WebRTC Video Calls integration.

---

© 2024 Wysh Group. Built for the future.