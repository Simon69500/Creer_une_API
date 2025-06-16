// Partie Reservations

const catwayId = 1;  // Remplace par le catway courant

document.getElementById('catwayId').textContent = catwayId;

const reservationsList = document.getElementById('reservationsList');
const form = document.getElementById('reservationForm');
const reservationIdInput = document.getElementById('reservationId');

async function fetchReservations() {
  const res = await fetch(`/catways/${catwayId}/reservations`, { credentials: 'include' });
  if (!res.ok) return alert('Erreur chargement réservations');
  const reservations = await res.json();

  reservationsList.innerHTML = '';
  reservations.forEach(r => {
    const li = document.createElement('li');
    li.textContent = `${r.clientName} - ${r.boatName} du ${new Date(r.startDate).toLocaleDateString()} au ${new Date(r.endDate).toLocaleDateString()}`;
    
    // Boutons Modifier et Supprimer
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Modifier';
    editBtn.onclick = () => fillFormForEdit(r);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Supprimer';
    deleteBtn.onclick = () => deleteReservation(r._id);
    
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    reservationsList.appendChild(li);
  });
}

function fillFormForEdit(reservation) {
  reservationIdInput.value = reservation._id;
  form.clientName.value = reservation.clientName;
  form.boatName.value = reservation.boatName;
  form.startDate.value = reservation.startDate.slice(0,10);  // yyyy-mm-dd
  form.endDate.value = reservation.endDate.slice(0,10);
}

form.onsubmit = async (e) => {
  e.preventDefault();

  const body = {
    catwayNumber: catwayId,
    clientName: form.clientName.value,
    boatName: form.boatName.value,
    startDate: form.startDate.value,
    endDate: form.endDate.value
  };

  let url = `/catways/${catwayId}/reservations`;
  let method = 'POST';

  if (reservationIdInput.value) {
    url += `/${reservationIdInput.value}`;
    method = 'PUT';
  }

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body)
  });

  if (res.ok) {
    alert('Réservation enregistrée');
    form.reset();
    reservationIdInput.value = '';
    fetchReservations();
  } else {
    alert('Erreur lors de la sauvegarde');
  }
};

async function deleteReservation(id) {
  if (!confirm('Confirmer suppression ?')) return;
  const res = await fetch(`/catways/${catwayId}/reservations/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (res.ok) {
    alert('Réservation supprimée');
    fetchReservations();
  } else {
    alert('Erreur suppression');
  }
}

document.getElementById('loadReservationsBtn').onclick = fetchReservations;

// Charger les réservations au chargement
fetchReservations();
