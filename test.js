const bcrypt = require('bcrypt');

async function createUser() {
  const plainPassword = '123456';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  console.log('Plain password:', plainPassword);
  console.log('Hashed password:', hashedPassword);

  // Ici tu simules l'enregistrement en base, par exemple :
  const user = {
    name: 'TestUser',
    email: 'testuser@example.com',
    password: hashedPassword
  };

  // Affiche le user avec hash prêt à être inséré en DB
  console.log('User to insert:', user);
}

createUser();
