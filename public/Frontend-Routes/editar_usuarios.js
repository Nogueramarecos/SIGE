const params = new URLSearchParams(window.location.search);
const usuarioId = params.get('id');

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

async function cargarUsuario() {
  try {
    const response = await fetch(`/api/usuarios/${usuarioId}`);
    const usuario = await response.json();

    document.getElementById('usuario_id').value = usuario.USUARIO_ID;
    document.getElementById('nombre').value = usuario.NOMBRE;
    document.getElementById('apellido').value = usuario.APELLIDO;
    document.getElementById('email').value = usuario.EMAIL;
    document.getElementById('username').value = usuario.USERNAME;
    document.getElementById('rol_id').value = usuario.ROL_ID;

  } catch (error) {
    console.error(error);
    alert('Error al cargar usuario');
  }
}

async function actualizarUsuario() {
  const id = document.getElementById('usuario_id').value;
  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const rol_id = document.getElementById('rol_id').value;

  if (!nombre || !apellido || !email || !username || !rol_id) {
    alert('Complete todos los campos');
    return;
  }

  try {
    const response = await fetch(`/api/usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rol_id,
        nombre,
        apellido,
        email,
        username
      })
    });

    const data = await response.json();

    alert(data.message);

    if (data.success) {
      window.location.href = 'usuarios.html';
    }

  } catch (error) {
    console.error(error);
    alert('Error al actualizar usuario');
  }
}

async function iniciar() {
  if (!usuarioId) {
    alert('No se recibió el ID del usuario');
    window.location.href = 'usuarios.html';
    return;
  }

  await cargarRoles();
  await cargarUsuario();
}

iniciar();