// Partie Reservations

const catwayId = 5;  // Remplace par le catway courant

const catwayList = document.getElementById('catwaysList');
const form = document.getElementById('catwayForm');
const catwayIdInput = document.getElementById('catwayIdInput');
document.getElementById('catwayIdInput').textContent = catwayId;

async function loadCatway() {
    
    try {
        let res = await fetch('/catways', {
        method: 'GET',
        credentials: 'include',
        headers: {'Accept': 'application/json', }
        });

        if (!res.ok) {
        return alert('Erreur chargement réservations');
        }

        const catways = await res.json();
        console.log("Catways reçus :", catways);

        catwayList.innerHTML = '';

        catways.forEach(c => {
            const li = document.createElement('li');
            li.textContent = `${c.catwayNumber} - ${c.catwayType} - ${c.catwayState} `;
    
        // Boutons Modifier et Supprimer
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Modifier';
        editBtn.onclick = () => fillFormForEdit(c);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Supprimer';
        deleteBtn.onclick = () => deleteCatway(c._id);
        
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        catwayList.appendChild(li);
        });

    } catch(e) {
        console.log('Erreur chargement catways');
    }
}

    // Recuperation des données du form
function fillFormForEdit(catways) {
    catwayIdInput.value = catways._id;
    form.catwayNumber.value = catways.catwayNumber;
    form.catwayType.value = catways.catwayType;
    form.catwayState.value = catways.catwayState
}

// Envoie des données du form    
form.onsubmit = async (e) => {
    e.preventDefault();

    const body = {
        catwayNumber: catwayId,
        catwayType: form.catwayType.value,
        catwayState: form.catwayState.value,
    };

    let url = `/catways/`;
    let method = 'POST';

    if (catwayIdInput.value) {
        url += `/${catwayIdInput.value}`;
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
    catwayIdInput.value = '';
    loadCatway();
  } else {
    alert('Erreur lors de la sauvegarde');
  }
};


// Supprimer
async function deleteCatway(id) {
  if (!confirm('Confirmer suppression ?')) return;
  const res = await fetch(`/catways/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (res.ok) {
    alert('Réservation supprimée');
    loadCatway();
  } else {
    alert('Erreur suppression');
  }
}

document.getElementById('loadCatwayBtn').onclick = loadCatway;

// Charger les réservations au chargement
loadCatway();
