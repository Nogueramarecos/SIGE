async function cargarRoles() {
  try {
    const response = await fetch('/api/roles');
    const roles = await response.json();

    let opciones = '<option value="">Seleccione un rol</option>';

    roles.forEach(r => {
      opciones += `
        <option value="${r.ROL_ID}">
          ${r.NOMBRE}
        </option>
      `;
    });

    document.getElementById('rol_id').innerHTML = opciones;

  } catch (error) {
    console.error(error);
    alert('Error al cargar roles');
  }
}

async function crearUsuario() {
  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const rol_id = document.getElementById('rol_id').value;

  if (!nombre || !apellido || !email || !username || !password || !rol_id) {
    alert('Complete todos los campos');
    return;
  }

  try {
    const response = await fetch('/api/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rol_id,
        nombre,
        apellido,
        email,
        username,
        password
      })
    });

    const data = await response.json();

    alert(data.message);

    if (data.success) {
      window.location.href = 'usuarios.html';
    }

  } catch (error) {
    console.error(error);
    alert('Error al crear usuario');
  }
}

cargarRoles();