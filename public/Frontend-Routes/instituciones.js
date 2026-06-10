async function cargarInstituciones() {
  try {

    const response = await fetch('/api/instituciones');
    const datos = await response.json();

    console.log('INSTITUCIONES RECIBIDAS:', datos);

    let filas = '';

    datos.forEach(i => {

      filas += `
        <tr>
          <td>${i.INSTITUCION_ID || i.institucion_id || ''}</td>
          <td>${i.NOMBRE || i.nombre || ''}</td>
          <td>${i.TIPO || i.tipo || ''}</td>
          <td>${i.TELEFONO || i.telefono || ''}</td>
          <td>${i.CIUDAD || i.ciudad || ''}</td>
          <td>${(i.ACTIVO || i.activo) === 'S' ? 'Activo' : 'Inactivo'}</td>
        </tr>
      `;

    });

    document.querySelector('#tablaInstituciones tbody').innerHTML = filas;

    if ($.fn.DataTable.isDataTable('#tablaInstituciones')) {
      $('#tablaInstituciones').DataTable().destroy();
    }

    $('#tablaInstituciones').DataTable({
      pageLength: 5,
      order: [[0, 'desc']],
      language: {
        search: 'Buscar:',
        lengthMenu: 'Mostrar _MENU_ registros',
        info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
        zeroRecords: 'No se encontraron resultados',
        emptyTable: 'No hay instituciones registradas',
        paginate: {
          previous: 'Anterior',
          next: 'Siguiente'
        }
      }
    });

  } catch (error) {

    console.error(error);
    alert('Error al cargar instituciones');

  }
}

async function guardarInstitucion() {

  const nombre = document.getElementById('nombre').value.trim();
  const tipo = document.getElementById('tipo').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const ciudad = document.getElementById('ciudad').value.trim();

  if (!nombre || !tipo || !telefono || !direccion || !ciudad) {

    alert('Complete todos los campos');
    return;

  }

  try {

    const response = await fetch('/api/instituciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre,
        tipo,
        telefono,
        direccion,
        ciudad
      })
    });

    const data = await response.json();

    if (data.success) {

      alert('Institución registrada correctamente');

      document.getElementById('nombre').value = '';
      document.getElementById('tipo').value = '';
      document.getElementById('telefono').value = '';
      document.getElementById('direccion').value = '';
      document.getElementById('ciudad').value = '';

      cargarInstituciones();

    } else {

      alert(data.message || 'No se pudo registrar');

    }

  } catch (error) {

    console.error(error);
    alert('Error al registrar institución');

  }
}

document.addEventListener('DOMContentLoaded', () => {
  cargarInstituciones();
});