
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Wysh Care Data Foundation Seed...");

  // 1. Create Users
  const doctorUser = await prisma.user.upsert({
    where: { email: "doctor@wysh.demo" },
    update: {},
    create: {
      email: "doctor@wysh.demo",
      name: "Dr. Sarah Chen",
      role: "DOCTOR",
      password: "password", // In prod, hash this
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
      isActive: true
    },
  });

  const patientUser = await prisma.user.upsert({
    where: { email: "patient@wysh.demo" },
    update: {
      abhaAddress: "alex.doe@abdm",
      abhaLinked: true,
      abhaLinkedAt: new Date(),
    },
    create: {
      email: "patient@wysh.demo",
      name: "Alex Doe",
      role: "PATIENT",
      password: "password",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      abhaAddress: "alex.doe@abdm",
      abhaLinked: true,
      abhaLinkedAt: new Date(),
      isActive: true
    },
  });

  // 2. Profiles
  const doctor = await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      specialty: "Cardiology",
      experienceYears: 12,
      licenseNumber: "MED-CA-9921"
    },
  });

  const patient = await prisma.patient.upsert({
    where: { userId: patientUser.id },
    update: {},
    create: {
      userId: patientUser.id,
      wyshId: "WYSH-IND-9X82K",
      gender: "MALE",
      dob: new Date("1990-05-20"),
      bloodGroup: "O+"
    },
  });

  // 3. Emergency Profile
  await prisma.emergencyProfile.upsert({
    where: { patientId: patient.id },
    update: {},
    create: {
      patientId: patient.id,
      primaryContact: "+1 (555) 019-2834",
      primaryRel: "Spouse",
      instructions: "Patient has history of arrhythmia. Verify meds."
    }
  });

  console.log("✅ Identity & Profiles seeded");

  // 4. Clinical Encounter
  const encounter = await prisma.encounter.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      type: "TELECONSULT",
      status: "COMPLETED",
      scheduledAt: new Date(),
      startedAt: new Date(),
      endedAt: new Date()
    },
  });

  // 5. SOAP Notes (Aligned with new Schema)
  await prisma.sOAPNote.create({
    data: {
      encounterId: encounter.id,
      subjective: "Patient reports mild palpitations after exercise.",
      objective: "BP 120/80. HR 72 regular. No murmurs.",
      assessment: "Stable sinus rhythm. Controlled arrhythmia.",
      plan: "Continue current beta-blocker therapy. Follow up in 3 months."
    }
  });

  // 6. Legacy Note Support
  await prisma.clinicalNote.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      encounterId: encounter.id,
      content: "SOAP Note summary: Stable arrhythmia. Continue meds.",
      shared: true
    }
  });

  // 7. Prescription
  const rx = await prisma.prescription.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      encounterId: encounter.id,
      notes: "Take with food.",
      status: "ACTIVE"
    },
  });

  await prisma.prescriptionItem.create({
    data: {
      prescriptionId: rx.id,
      medicine: "Metoprolol",
      dosage: "50mg",
      frequency: "Twice Daily",
      duration: "30 Days"
    }
  });

  // 8. Longitudinal Records
  await prisma.condition.create({
    data: {
      patientId: patient.id,
      diagnosis: "Cardiac Arrhythmia",
      status: "Active",
      onsetDate: new Date("2023-01-15")
    }
  });

  await prisma.allergy.create({
    data: {
      patientId: patient.id,
      allergen: "Peanuts",
      severity: "Severe",
      reaction: "Anaphylaxis"
    }
  });

  // 9. Vitals (Observations)
  await prisma.observation.create({
    data: {
      encounterId: encounter.id,
      patientId: patient.id,
      name: "Heart Rate",
      value: "72",
      unit: "bpm"
    }
  });

  // 10. Consent (ABDM)
  await prisma.consent.create({
    data: {
      consentId: "CONSENT-DEMO-" + Math.floor(Math.random() * 10000),
      patientId: patient.id,
      patientUserId: patientUser.id,
      purpose: "Care Management",
      hipName: "Apollo Hospital",
      status: "GRANTED",
      dataScope: "LAB_REPORTS,PRESCRIPTIONS",
      validFrom: new Date(),
      validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    }
  });

  console.log("✅ Clinical Data Foundation seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
