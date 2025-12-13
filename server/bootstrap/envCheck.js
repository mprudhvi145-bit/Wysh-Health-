export function envCheck() {
  const required = [
    "JWT_SECRET",
    "GOOGLE_CLIENT_ID", 
    "CLIENT_URL"
  ];

  // Optional: Add GEMINI_API_KEY to required if not using mock AI
  if (!process.env.USE_MOCK_AI && !process.env.GEMINI_API_KEY) {
      // warning or error depending on strictness
      console.warn("⚠️  GEMINI_API_KEY is missing. AI features may fail.");
  }

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error("❌ CRITICAL: Missing required environment variables:");
    missing.forEach(key => console.error(`   - ${key}`));
    console.error("   Server cannot start securely. Exiting.");
    process.exit(1);
  }

  // Validate Database Config if enabled
  if (process.env.USE_DB === "true" && !process.env.DATABASE_URL) {
      console.error("❌ CRITICAL: USE_DB is true but DATABASE_URL is missing.");
      process.exit(1);
  }

  console.log("✅ Environment configuration validated.");
}