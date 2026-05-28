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
      mostrarMensaje('No se encontró la emergencia seleccionada', 'error');
      return;
    }

    document.getElementById('emergencia_id').value = emergencia.EMERGENCIA_ID;
    document.getElementById('tipo').value = emergencia.TIPO || '';
    document.getElementById('prioridad').value = emergencia.PRIORIDAD || '';
    document.getElementById('estado').value = emergencia.ESTADO || 'PENDIENTE';
    document.getElementById('ciudad').value = emergencia.CIUDAD || '';
    document.getElementById('direccion').value = emergencia.DIRECCION || '';
    document.getElementById('descripcion').value = emergencia.DESCRIPCION || '';

  } catch (error) {
    console.error(error);
    mostrarMensaje('Error al cargar emergencia', 'error');
  }
}

async function actualizarEmergencia() {
  const emergenciaId = document.getElementById('emergencia_id').value;

  const tipo = document.getElementById('tipo').value.trim();
  const prioridad = document.getElementById('prioridad').value.trim();
  const estado = document.getElementById('estado').value.trim();
  const ciudad = document.getElementById('ciudad').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();

  if (!tipo || !prioridad || !estado || !ciudad || !direccion || !descripcion) {
    mostrarMensaje('Complete todos los campos', 'error');
    return;
  }

  try {
    const response = await fetch(`/api/emergencias/${emergenciaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tipo,
        prioridad,
        estado,
        ciudad,
        direccion,
        descripcion
      })
    });

    const data = await response.json();

    if (data.success) {
      mostrarMensaje('Emergencia actualizada correctamente', 'success');
    } else {
      mostrarMensaje(data.message || 'No se pudo actualizar', 'error');
    }

  } catch (error) {
    console.error(error);
    mostrarMensaje('Error al actualizar emergencia', 'error');
  }
}

function mostrarMensaje(texto, tipo) {
  const mensaje = document.getElementById('mensaje');

  mensaje.style.display = 'block';
  mensaje.className = `mensaje ${tipo}`;
  mensaje.innerHTML = texto;
}

cargarEmergencia();