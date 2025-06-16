



async function userConnect() {

    try {
        const res = await fetch(`/users/${email}`, {
            credentials:'include',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (!res.ok) {
            throw new Error("Erreur API : " + res.status);
        }

        const user = await res.json();
        console.log("Utilisateur :", user);

        const userDom = document.querySelector("#user");
        const ul = document.createElement("ul");
        const li = document.createElement("li");
        li.textContent = `${user.name} - ${user.email}`;
        ul.appendChild(li);
        userDom.appendChild(ul);

    } catch (e) {
        console.error("Erreur de récupération :", e);
    }
}

userConnect();
