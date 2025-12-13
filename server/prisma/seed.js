
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Wysh Care Seed...");

  // 1. Cleanup (Optional: use with caution in prod)
  // await prisma.prescriptionItem.deleteMany();
  // await prisma.clinicalNote.deleteMany();
  
  // 2. USERS
  const doctorUser = await prisma.user.upsert({
    where: { email: "doctor@wysh.demo" },
    update: {},
    create: {
      email: "doctor@wysh.demo",
      name: "Dr. Aarav Mehta",
      role: "DOCTOR",
      provider: "WYSH",
      password: "password", // In real app, this should be hashed
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300"
    },
  });

  const patientUser = await prisma.user.upsert({
    where: { email: "patient@wysh.demo" },
    update: {
      abhaAddress: "rohan@abdm",
      abhaLinked: true,
      abhaLinkedAt: new Date(),
    },
    create: {
      email: "patient@wysh.demo",
      name: "Rohan Sharma",
      role: "PATIENT",
      provider: "WYSH",
      password: "password",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
      abhaAddress: "rohan@abdm",
      abhaLinked: true,
      abhaLinkedAt: new Date(),
    },
  });

  console.log("✅ Users seeded");

  // 3. PROFILES
  const doctor = await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      specialty: "General Physician",
      experienceYears: 12,
      licenseNumber: "MED-IND-8842"
    },
  });

  const patient = await prisma.patient.upsert({
    where: { userId: patientUser.id },
    update: {},
    create: {
      userId: patientUser.id,
      gender: "Male",
      phone: "+91 98765 43210",
      dob: new Date("1990-05-15")
    },
  });

  console.log("✅ Profiles seeded");

  // 4. CLINICAL ENCOUNTER
  const encounter = await prisma.encounter.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      scheduledAt: new Date(), // Today
      status: "COMPLETED",
      type: "video"
    },
  });

  // 5. SOAP NOTE
  await prisma.clinicalNote.create({
    data: {
      encounterId: encounter.id,
      patientId: patient.id,
      doctorId: doctor.id,
      content: `Subjective: Patient reports moderate fever (101°F) and fatigue for 2 days. No breathing difficulty.\n\nObjective: Throat slightly inflamed. Lungs clear. Vitals stable.\n\nAssessment: Suspected Viral Fever.\n\nPlan: Prescribed antipyretics and hydration. Review in 3 days if symptoms persist.`,
      shared: true,
    },
  });

  // 6. PRESCRIPTION
  const rx = await prisma.prescription.create({
    data: {
      encounterId: encounter.id,
      patientId: patient.id,
      doctorId: doctor.id,
      notes: "Take after meals. Maintain hydration.",
    },
  });

  await prisma.prescriptionItem.createMany({
    data: [
      {
        prescriptionId: rx.id,
        medicine: "Dolo 650",
        dosage: "650mg",
        frequency: "SOS",
        duration: "3 days",
      },
      {
        prescriptionId: rx.id,
        medicine: "Vitamin C",
        dosage: "500mg",
        frequency: "OD",
        duration: "10 days",
      }
    ],
  });

  // 7. LAB ORDER
  await prisma.labOrder.create({
    data: {
      encounterId: encounter.id,
      patientId: patient.id,
      doctorId: doctor.id,
      status: "COMPLETED",
      tests: ["Complete Blood Count (CBC)", "Dengue NS1 Antigen"],
      priority: "Routine"
    },
  });

  // 8. VITALS
  await prisma.vital.createMany({
    data: [
      {
        patientId: patient.id,
        type: "Temperature",
        value: "100.4",
        unit: "F",
        recordedAt: new Date()
      },
      {
        patientId: patient.id,
        type: "SpO2",
        value: "98",
        unit: "%",
        recordedAt: new Date()
      }
    ]
  });

  // 9. ALLERGIES & PROBLEMS
  await prisma.allergy.create({
    data: {
      patientId: patient.id,
      allergen: "Sulfa Drugs",
      reaction: "Skin Rash",
      severity: "Moderate"
    },
  });

  await prisma.problem.create({
    data: {
      patientId: patient.id,
      diagnosis: "Viral Pyrexia",
      status: "Active",
      onsetDate: new Date()
    }
  });

  console.log("✅ Clinical records seeded");

  // 10. ABDM CONSENT
  // Seed a pre-granted consent to simulate "Import External Records" flow
  await prisma.abdmConsent.create({
    data: {
      patientUserId: patientUser.id,
      patientId: patient.id,
      consentId: "CONSENT-DEMO-" + Math.floor(Math.random() * 10000),
      purpose: "Care Management",
      dataScope: "Prescription,DiagnosticReport",
      hipName: "Max Super Specialty Hospital",
      status: "GRANTED",
      dateGranted: new Date(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    },
  });

  console.log("✅ ABDM Consents seeded");
  console.log("🚀 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
