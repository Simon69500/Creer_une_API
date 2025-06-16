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

        let userDom = document.querySelector(".user");
        let title = document.createElement("h3");
        title.textContent = `${user.name} ${user.email}`;
        userDom.appendChild(title);

    } catch (e) {
        console.error("Erreur de récupération :", e);
    }
}

userConnect();

function date () {
    let dateDiv = document.querySelector('.date');
    let time = document.createElement('h3')
    let today = new Date();
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let formattedDate = today.toLocaleDateString('fr-FR', options);
    time.textContent= formattedDate;
    dateDiv.appendChild(time);
}

date();

async function reservationUser() {
    try {

        let res = await fetch(`/catways/${id}/reservations`, {
          headers: { 'Accept': 'application/json' }
        });

        if (!res.ok) throw new Error('Erreur API : ' + res.status);

        let reservations = await res.json();

        let tableDiv = document.querySelector('.table');
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

reservationUser();


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