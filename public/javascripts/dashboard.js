// Partie Dashboard

// function pour afficher le nom + email user
async function userConnect() {

    try {
        let res = await fetch('/me', {
            method: 'GET',
            credentials: 'include',
            headers: {'Accept': 'application/json', }
        });

        if (!res.ok) {
            throw new Error("Erreur API : " + res.status);
        }

        let user = await res.json();
        console.log("Utilisateur :", user);

        let userDom = document.getElementById("user");
        let title = document.createElement("h3");
        title.textContent = `${user.name} ${user.email}`;
        userDom.appendChild(title);

    } catch (e) {
        console.error("Erreur de récupération :", e);
    }
};

userConnect();

// afficher la date 
function date () {
    let dateDiv = document.getElementById("date");
    let time = document.createElement('h3')
    let today = new Date();
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let formattedDate = today.toLocaleDateString('fr-FR', options);
    time.textContent= formattedDate;
    dateDiv.appendChild(time);
}

date();


// Affichage des reservation User dans le dashboard

async function reservationUser(catwayId) {

  try {
    let res = await fetch(`/catways/${catwayId}/reservations`, {
      method: "GET",
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) {
      throw new Error('Erreur API : ' + res.status);
    }

    let reservations = await res.json();

    let tableDiv = document.getElementById("table");
    if (!tableDiv) throw new Error("Élément .table introuvable");

    tableDiv.innerHTML = '';

    let list = document.createElement("ul");

    reservations.forEach(r => {
      const start = new Date(r.startDate);
      const end = new Date(r.endDate);

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const startFormatted = start.toLocaleDateString('fr-FR', options);
      const endFormatted = end.toLocaleDateString('fr-FR', options);

      let item = document.createElement("li");
      item.textContent = `${r.clientName} - ${r.boatName} du ${startFormatted} au ${endFormatted}`;
      list.appendChild(item);
    });

    tableDiv.appendChild(list);

  } catch (e) {
    console.error(e);
  }
}

reservationUser(catwayId);

//Bouton Déconnecter
function logout() {

    document.getElementById('logoutBtn').addEventListener('click', async ( ) => {
        try {
            const res = await fetch('/users/logout', {
            method: 'POST',
            credentials: 'include', 
        });
        if (res.ok) {
        window.location.href = '/'; // redirection vers l'accueil après déconnexion
      } else {
        console.error('Erreur lors de la déconnexion');
      }
    } catch (e) {
      console.error('Erreur réseau', e);
    }
    });
}
logout();


