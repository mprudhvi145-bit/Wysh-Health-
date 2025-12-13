import { useClinicalContext } from "../context/ClinicalContext";

export const useClinical = () => {
  const ctx = useClinicalContext();
  return {
    patientId: ctx.patientId,
    patient: ctx.chart.patient,
    appointments: ctx.chart.appointments || [],
    prescriptions: ctx.chart.prescriptions || [],
    // Map backend keys to what UI expects if needed, or stick to backend keys
    labOrders: ctx.chart.labOrders || [], 
    clinicalNotes: ctx.chart.clinicalNotes || [], 
    documents: ctx.chart.documents || [],
    catalogs: ctx.catalogs, // Expose catalogs
    loading: ctx.loading,
    error: ctx.error,
    refresh: ctx.refresh,
    loadPatient: ctx.loadPatient,
    clear: ctx.clear
  };
};