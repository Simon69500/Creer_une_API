  const params = new URLSearchParams(window.location.search);
  if (params.get("created") === "true") {
    alert("Utilisateur créé avec succès !");
  }

  
// Déconnexion au clic sur le bouton
document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    const res = await fetch('/users/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (res.ok) {
      window.location.href = '/';
    } else {
      alert("Échec de la déconnexion.");
    }
  } catch (err) {
    console.error("Erreur de déconnexion :", err);
    alert("Une erreur est survenue.");
  }
});

