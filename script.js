const SUPABASE_URL = "https://bhobphbpwdshepyixjlu.supabase.co"; // Remplace par ton URL Supabase
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJob2JwaGJwd2RzaGVweWl4amx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1NTQ4MjEsImV4cCI6MjA1MTEzMDgyMX0.evJ3bYl-m25OIc9y4I5eIGFmP4_ZTEChImfo8kHuj2Y"; // Remplace par ta clé publique

// Supabase client

const { createClient } = supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const calendar = document.getElementById("calendar");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
const addAppointmentButton = document.getElementById("add-appointment");
const appointmentForm = document.getElementById("appointment-form");

// Charger les rendez-vous depuis Supabase
async function loadAppointments() {
  const { data, error } = await supabase.from("appointments").select("*");
  if (error) {
    console.error("Erreur lors du chargement :", error);
    return;
  }

  calendar.innerHTML = ""; // Réinitialise le calendrier

  // Regrouper par date
  const grouped = data.reduce((acc, appointment) => {
    acc[appointment.date] = acc[appointment.date] || [];
    acc[appointment.date].push(appointment);
    return acc;
  }, {});

  for (let i = 1; i <= 30; i++) {
    const date = `2024-12-${String(i).padStart(2, "0")}`;
    const dayCell = document.createElement("div");
    dayCell.textContent = `Jour ${i}`;
    if (grouped[date]) {
      dayCell.style.background = "#d1e7dd";
    }
    calendar.appendChild(dayCell);
  }
}

// Ajouter un rendez-vous
appointmentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  const { error } = await supabase.from("appointments").insert([
    { date, time, title, description, user: "test_user" },
  ]);

  if (error) {
    console.error("Erreur lors de l'ajout :", error);
    return;
  }

  modal.style.display = "none";
  loadAppointments();
});

// Ouvrir et fermer la modale
addAppointmentButton.addEventListener("click", () => (modal.style.display = "flex"));
closeModal.addEventListener("click", () => (modal.style.display = "none"));

// Initialisation
loadAppointments();
