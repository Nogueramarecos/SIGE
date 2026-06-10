async function cargarEmergencias() {
  try {
    const response = await fetch('/api/emergencias');
    const datos = await response.json();

    let filas = '';

    datos.forEach(e => {
      filas += `
        <tr>
          <td>${e.EMERGENCIA_ID}</td>
          <td>${e.TIPO || ''}</td>
          <td>
            <span class="badge ${clasePrioridad(e.PRIORIDAD)}">
              ${e.PRIORIDAD || ''}
            </span>
          </td>
          <td>
            <span class="badge ${claseEstado(e.ESTADO)}">
              ${e.ESTADO || ''}
            </span>
          </td>
          <td>${e.CIUDAD || ''}</td>
          <td>${e.DIRECCION || ''}</td>
          <td>${e.INSTITUCION || 'Sin asignar'}</td>
          <td>${e.UNIDAD || 'Sin asignar'}</td>
          <td>${e.DESCRIPCION || ''}</td>
          <td>
            <div class="acciones">
              <a class="btn btn-editar" href="actualizar_emergencias.html?id=${e.EMERGENCIA_ID}">
                Editar
              </a>

              <a class="btn btn-eliminar" href="eliminar_emergencias.html?id=${e.EMERGENCIA_ID}">
                Eliminar
              </a>
            </div>
          </td>
        </tr>
      `;
    });

    document.querySelector('#tablaEmergencias tbody').innerHTML = filas;

    new DataTable('#tablaEmergencias', {
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50],
      order: [[0, 'desc']],
      language: {
        search: 'Buscar:',
        lengthMenu: 'Mostrar _MENU_ registros',
        info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
        infoEmpty: 'No hay registros disponibles',
        infoFiltered: '(filtrado de _MAX_ registros totales)',
        zeroRecords: 'No se encontraron resultados',
        emptyTable: 'No hay emergencias registradas',
        paginate: {
          first: 'Primero',
          previous: 'Anterior',
          next: 'Siguiente',
          last: 'Último'
        }
      }
    });

  } catch (error) {
    console.error(error);
    alert('Error al cargar emergencias');
  }
}

function clasePrioridad(valor) {
  valor = String(valor || '').toUpperCase();

  if (valor === 'CRITICA') return 'critica';
  if (valor === 'ALTA') return 'alta';
  if (valor === 'MEDIA') return 'media';

  return 'baja';
}

function claseEstado(valor) {
  valor = String(valor || '').toUpperCase();

  if (valor === 'PENDIENTE') return 'pendiente';
  if (valor === 'ASIGNADA') return 'asignada';
  if (valor === 'EN_PROCESO') return 'proceso';
  if (valor === 'ATENDIDA') return 'atendida';
  if (valor === 'CANCELADA') return 'cancelada';

  return 'pendiente';
}

cargarEmergencias();