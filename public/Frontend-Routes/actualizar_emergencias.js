const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function cargarCombos() {
  await cargarInstituciones();
  await cargarUnidades();
}

async function cargarInstituciones() {
  try {
    const response = await fetch('/api/instituciones');
    const instituciones = await response.json();

    const select = document.getElementById('institucion_id');
    select.innerHTML = '<option value="">Seleccione institución</option>';

    instituciones.forEach(i => {
      select.innerHTML += `
        <option value="${i.INSTITUCION_ID}">
          ${i.NOMBRE} - ${i.TIPO}
        </option>
      `;
    });

  } catch (error) {
    console.error(error);
    mostrarMensaje('Error al cargar instituciones', 'error');
  }
}

async function cargarUnidades() {
  try {
    const response = await fetch('/api/unidades');
    const unidades = await response.json();

    const select = document.getElementById('unidad_id');
    select.innerHTML = '<option value="">Seleccione unidad</option>';

    unidades.forEach(u => {
      select.innerHTML += `
        <option value="${u.UNIDAD_ID}">
          ${u.CODIGO} - ${u.TIPO} - ${u.INSTITUCION}
        </option>
      `;
    });

  } catch (error) {
    console.error(error);
    mostrarMensaje('Error al cargar unidades', 'error');
  }
}

async function cargarEmergencia() {
  if (!id) {
    mostrarMensaje('No se recibió el ID de la emergencia', 'error');
    return;
  }

  try {
    await cargarCombos();

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

    document.getElementById('institucion_id').value = emergencia.INSTITUCION_ID || '';
    document.getElementById('unidad_id').value = emergencia.UNIDAD_ID || '';

  } catch (error) {
    console.error(error);
    mostrarMensaje('Error al cargar emergencia', 'error');
  }
}

async function actualizarEmergencia() {
  const emergenciaId = document.getElementById('emergencia_id').value;

  const tipo = document.getElementById('tipo').value.trim();
  const prioridad = document.getElementById('prioridad').value.trim();
  const estado = document.getElementById('estado').value.trim().toUpperCase().replace(/\s+/g, '_');
  const ciudad = document.getElementById('ciudad').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();

  const institucion_id = document.getElementById('institucion_id').value;
  const unidad_id = document.getElementById('unidad_id').value;

  if (!tipo || !prioridad || !estado || !ciudad || !direccion || !descripcion) {
    mostrarMensaje('Complete todos los campos obligatorios', 'error');
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
        descripcion,
        institucion_id,
        unidad_id
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