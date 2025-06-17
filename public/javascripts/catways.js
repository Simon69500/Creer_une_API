const catwayList = document.getElementById('catwaysList');
const form = document.getElementById('catwayForm');
const catwayIdInput = document.getElementById('catwayIdInput');
const catwayIdDisplay = document.getElementById('catwayIdDisplay');
const btnModifForm = document.querySelector('.btnModifForm');
const btnForm = document.querySelector('.btnForm');

// Affiche l'ID courant ou 'N/A'
catwayIdDisplay.textContent = catwayIdInput.value || 'N/A';

async function loadCatway() {
    try {
        const res = await fetch('/catways', {
            method: 'GET',
            credentials: 'include',
            headers: {'Accept': 'application/json'}
        });

        if (!res.ok) {
            alert('Erreur chargement réservations');
            return;
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
            editBtn.onclick = () => inputFormForEdit(c);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Supprimer';
            deleteBtn.onclick = () => deleteCatway(c._id);

            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            catwayList.appendChild(li);
        });

    } catch (e) {
        console.error('Erreur chargement catways', e);
    }
}

function modifState() {
    const inputState = document.getElementById('catwayState');

    btnModifForm.addEventListener('click', async (e) => {
        e.preventDefault();

        const catwayId = catwayIdInput.value;
        if (!catwayId) {
            alert('Aucun Etat sélectionné pour modification , Seulement Etat modifiable.');
            return;
        }

        const body = { catwayState: inputState.value };

        const res = await fetch(`/catways/${catwayId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(body)
        });

        if (res.ok) {
            alert('Modification enregistrée');
            form.reset();
            catwayIdInput.value = '';
            catwayIdDisplay.textContent = 'N/A';
            loadCatway();
        } else {
            alert('Erreur lors de la sauvegarde');
        }
    });
}

function inputFormForEdit(catway) {
    catwayIdInput.value = catway._id;
    catwayIdDisplay.textContent = catway._id;

    form.catwayState.value = catway.catwayState;
    form.catwayState.disabled = false;

    // Active/désactive boutons en fonction du contexte
    btnForm.disabled = false;
    btnModifForm.disabled = false;
}

// Envoi du formulaire pour créer un nouveau catway
form.onsubmit = async (e) => {
    e.preventDefault();

    const body = {
        catwayNumber: form.catwayNumber.value,
        catwayType: form.catwayType.value,
        catwayState: form.catwayState.value,
    };

    const res = await fetch(`/catways/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
    });

    if (res.ok) {
        alert('Réservation enregistrée');
        form.reset();
        catwayIdInput.value = '';
        catwayIdDisplay.textContent = 'N/A';
        loadCatway();
    } else {
        alert('Erreur lors de la sauvegarde');
    }
};

// Suppression d'un catway
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

// Initialisation
loadCatway();
modifState();
