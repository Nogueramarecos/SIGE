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
    alert('Error al cargar instituciones');
  }
}

async function cargarUnidades() {
  try {
    const response = await fetch('/api/unidades');
    const datos = await response.json();

    let filas = '';

    datos.forEach(u => {
      filas += `
        <tr>
          <td>${u.UNIDAD_ID || ''}</td>
          <td>${u.INSTITUCION || ''}</td>
          <td>${u.CODIGO || ''}</td>
          <td>${u.TIPO || ''}</td>
          <td>${u.ESTADO || ''}</td>
          <td>${u.ACTIVO === 'S' ? 'Activo' : 'Inactivo'}</td>
          <td>${u.DESCRIPCION || ''}</td>
        </tr>
      `;
    });

    if ($.fn.DataTable.isDataTable('#tablaUnidades')) {
      $('#tablaUnidades').DataTable().clear().destroy();
    }

    document.querySelector('#tablaUnidades tbody').innerHTML = filas;

    $('#tablaUnidades').DataTable({
      pageLength: 5,
      order: [[0, 'desc']],
      language: {
        search: 'Buscar:',
        lengthMenu: 'Mostrar _MENU_ registros',
        info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
        zeroRecords: 'No se encontraron resultados',
        emptyTable: 'No hay unidades registradas',
        paginate: {
          previous: 'Anterior',
          next: 'Siguiente'
        }
      }
    });

  } catch (error) {
    console.error(error);
    alert('Error al cargar unidades');
  }
}

async function guardarUnidad() {
  const institucion_id = document.getElementById('institucion_id').value;
  const codigo = document.getElementById('codigo').value.trim();
  const tipo = document.getElementById('tipo').value.trim();
  let estado = document.getElementById('estado').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();

  if (estado === 'FUERA_SERVICIO') {
    estado = 'FUERA DE SERVICIO';
  }

  if (!institucion_id || !codigo || !tipo || !estado) {
    alert('Complete todos los campos obligatorios');
    return;
  }

  try {
    const response = await fetch('/api/unidades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        institucion_id,
        codigo,
        tipo,
        descripcion,
        estado
      })
    });

    const data = await response.json();

    if (data.success) {
      alert('Unidad registrada correctamente');

      document.getElementById('institucion_id').value = '';
      document.getElementById('codigo').value = '';
      document.getElementById('tipo').value = '';
      document.getElementById('estado').value = 'DISPONIBLE';
      document.getElementById('descripcion').value = '';

      cargarUnidades();
    } else {
      alert(data.message || 'No se pudo registrar la unidad');
    }

  } catch (error) {
    console.error(error);
    alert('Error al registrar unidad');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  cargarInstituciones();
  cargarUnidades();
});