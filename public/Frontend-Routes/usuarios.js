async function cargarUsuarios() {

  try {

    const response = await fetch('/api/usuarios');

    const usuarios = await response.json();

    let filas = '';

    usuarios.forEach(u => {

      const estado = u.ACTIVO === 'S'
        ? 'Activo'
        : 'Inactivo';

      let botonEstado = '';

      if (u.ACTIVO === 'S') {

        botonEstado = `
          <button class="btn btn-eliminar"
            onclick="desactivarUsuario(${u.USUARIO_ID})">
            Desactivar
          </button>
        `;

      } else {

        botonEstado = `
          <button class="btn btn-crear"
            onclick="activarUsuario(${u.USUARIO_ID})">
            Activar
          </button>
        `;
      }

      filas += `
        <tr>
          <td>${u.USUARIO_ID}</td>
          <td>${u.NOMBRE}</td>
          <td>${u.APELLIDO}</td>
          <td>${u.EMAIL}</td>
          <td>${u.USERNAME}</td>
          <td>${u.ROL}</td>
          <td>${estado}</td>

          <td>

            <a
              href="editar_usuarios.html?id=${u.USUARIO_ID}"
              class="btn btn-volver">

              Editar

            </a>

            ${botonEstado}

          </td>

        </tr>
      `;

    });

    document.getElementById('tabla-usuarios').innerHTML =
      filas;

  } catch (error) {

    console.error(error);
    alert('Error al cargar usuarios');

  }

}

async function desactivarUsuario(id) {

  const confirmar =
    confirm('¿Desea desactivar este usuario?');

  if (!confirmar) return;

  try {

    const response =
      await fetch(`/api/usuarios/${id}/desactivar`, {
        method: 'PUT'
      });

    const data = await response.json();

    alert(data.message);

    cargarUsuarios();

  } catch (error) {

    console.error(error);
    alert('Error al desactivar usuario');

  }

}

async function activarUsuario(id) {

  const confirmar =
    confirm('¿Desea activar este usuario?');

  if (!confirmar) return;

  try {

    const response =
      await fetch(`/api/usuarios/${id}/activar`, {
        method: 'PUT'
      });

    const data = await response.json();

    alert(data.message);

    cargarUsuarios();

  } catch (error) {

    console.error(error);
    alert('Error al activar usuario');

  }

}

cargarUsuarios();