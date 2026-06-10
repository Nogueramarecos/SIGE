const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function cargarEmergencia() {
  if (!id) {
    mostrarMensaje('No se recibió el ID de la emergencia', 'error');
    return;
  }

  try {
    const response = await fetch('/api/emergencias');
    const datos = await response.json();

    const emergencia = datos.find(
      e => String(e.EMERGENCIA_ID) === String(id)
    );

    if (!emergencia) {
      document.getElementById('detalle').innerHTML =
        '<p>No se encontró la emergencia.</p>';
      return;
    }

    document.getElementById('detalle').innerHTML = `
      <div class="dato"><strong>ID:</strong> ${emergencia.EMERGENCIA_ID}</div>
      <div class="dato"><strong>Tipo:</strong> ${emergencia.TIPO || ''}</div>
      <div class="dato"><strong>Prioridad:</strong> ${emergencia.PRIORIDAD || ''}</div>
      <div class="dato"><strong>Estado:</strong> ${emergencia.ESTADO || ''}</div>
      <div class="dato"><strong>Ciudad:</strong> ${emergencia.CIUDAD || ''}</div>
      <div class="dato"><strong>Dirección:</strong> ${emergencia.DIRECCION || ''}</div>
      <div class="dato"><strong>Descripción:</strong> ${emergencia.DESCRIPCION || ''}</div>
    `;

  } catch (error) {
    console.error(error);
    mostrarMensaje('Error al cargar emergencia', 'error');
  }
}

async function eliminarEmergencia() {
  if (!id) {
    mostrarMensaje('No se recibió el ID de la emergencia', 'error');
    return;
  }

  if (!confirm('¿Confirmar eliminación de la emergencia?')) return;

  try {
    const response = await fetch(`/api/emergencias/${id}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (data.success) {
      mostrarMensaje('Emergencia eliminada correctamente', 'success');

      setTimeout(() => {
        window.location.href = 'listar_emergencias.html';
      }, 1200);

    } else {
      mostrarMensaje(data.message || 'No se pudo eliminar', 'error');
    }

  } catch (error) {
    console.error(error);
    mostrarMensaje('Error al eliminar emergencia', 'error');
  }
}

function mostrarMensaje(texto, tipo) {
  const mensaje = document.getElementById('mensaje');

  mensaje.style.display = 'block';
  mensaje.className = `mensaje ${tipo}`;
  mensaje.innerHTML = texto;
}

cargarEmergencia();