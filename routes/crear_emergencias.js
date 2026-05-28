async function guardarEmergencia() {
  const tipo = document.getElementById('tipo').value;
  const prioridad = document.getElementById('prioridad').value;
  const ciudad = document.getElementById('ciudad').value;
  const direccion = document.getElementById('direccion').value;
  const descripcion = document.getElementById('descripcion').value;

  if (!tipo || !prioridad || !ciudad || !direccion || !descripcion) {
    mostrarMensaje('Complete todos los campos', 'error');
    return;
  }

  try {
    const response = await fetch('/api/emergencias', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        tipo,
        prioridad,
        ciudad,
        direccion,
        descripcion
      })
    });

    const data = await response.json();

    if (data.success) {
      mostrarMensaje('Emergencia registrada correctamente', 'success');
      limpiarFormulario();
    } else {
      mostrarMensaje(data.message, 'error');
    }

  } catch (error) {
    console.error(error);
    mostrarMensaje('Error al registrar emergencia', 'error');
  }
}

function limpiarFormulario() {
  document.getElementById('tipo').value = '';
  document.getElementById('prioridad').value = '';
  document.getElementById('ciudad').value = '';
  document.getElementById('direccion').value = '';
  document.getElementById('descripcion').value = '';
}

function mostrarMensaje(texto, tipo) {
  const mensaje = document.getElementById('mensaje');

  mensaje.style.display = 'block';
  mensaje.className = `mensaje ${tipo}`;
  mensaje.innerHTML = texto;
}