
import { useClinicalContext } from "../context/ClinicalContext";

export const useClinical = () => {
  const ctx = useClinicalContext();
  return {
    patientId: ctx.patientId,
    patient: ctx.chart.patient,
    appointments: ctx.chart.appointments || [],
    prescriptions: ctx.chart.prescriptions || [],
    labOrders: ctx.chart.labOrders || [], 
    clinicalNotes: ctx.chart.clinicalNotes || [], 
    soapNotes: ctx.chart.soapNotes || [],
    documents: ctx.chart.documents || [],
    catalogs: ctx.catalogs, // Expose catalogs
    loading: ctx.loading,
    error: ctx.error,
    refresh: ctx.refresh,
    loadPatient: ctx.loadPatient,
    clear: ctx.clear
  };
};
