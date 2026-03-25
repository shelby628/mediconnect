export const departments = ["Cardiology", "Neurology", "Pediatrics", "Orthopedics", "General Medicine", "Dermatology"];

export const specialties = [
  "Cardiologist",
  "Neurologist",
  "Pediatrician",
  "Orthopedic Surgeon",
  "General Practitioner",
  "Dermatologist"
];

export const initialDoctors = [
  { id: 1, name: "Dr. Galavo Mumbi", department: "Cardiology", specialty: "Interventional Cardiologist", status: "Available" },
  { id: 2, name: "Dr. Lynette Wanjiku", department: "Neurology", specialty: "Stroke Specialist", status: "Fully Booked" },
  { id: 3, name: "Dr. Emily Davis", department: "Pediatrics", specialty: "Child Psychologist", status: "Available" },
  { id: 4, name: "Dr. Christina Atieno", department: "Orthopedics", specialty: "Knee Surgeon", status: "Unavailable" },
  { id: 5, name: "Dr. Meredith Grey", department: "General Medicine", specialty: "Internist", status: "Available" },
  { id: 6, name: "Dr. Cliff Miller", department: "Dermatology", specialty: "Cosmetic Dermatologist", status: "Available" },
  { id: 7, name: "Dr. David Brown", department: "Cardiology", specialty: "Heart Surgeon", status: "Available" },
  { id: 8, name: "Dr. Patricia Moore", department: "Pediatrics", specialty: "Neonatologist", status: "Available" }
];

export const initialAppointments = [
  { id: "APT-12345", doctor: "Dr. Sarah Johnson", department: "Cardiology", dateTime: "2024-03-25T10:00", status: "Approved", type: "Upcoming" },
  { id: "APT-12344", doctor: "Dr. Linda Garcia", department: "General Medicine", dateTime: "2024-02-15T14:30", status: "Completed", type: "Past" }
];

export const initialConsultations = [
  { id: "CNS-001", doctor: "Dr. Linda Garcia", department: "General Medicine", date: "2024-02-15", notes: "Patient reported fatigue. Recommended blood work and rest.", followUp: "No" },
  { id: "CNS-002", doctor: "Dr. Sarah Johnson", department: "Cardiology", date: "2024-01-20", notes: "Regular checkup. BP is normal. Next visit in 6 months.", followUp: "Yes" }
];

export const initialTickets = [
  { id: "TKT-001", subject: "Portal Login Issue", type: "Technical", status: "Resolved", message: "I couldn't login yesterday.", date: "2026-03-01" },
  { id: "TKT-002", subject: "Appointment Rescheduling", type: "Appointment", status: "Pending", message: "I need to move my appointment.", date: "2026-03-05" }
];
