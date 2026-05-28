async function cargarReporte(tipo) {

  try {

    const response =
      await fetch(`/api/reportes/${tipo}`);

    const datos = await response.json();

    let filas = '';

    datos.forEach(e => {

      filas += `
        <tr>
          <td>${e.EMERGENCIA_ID}</td>
          <td>${e.TIPO || ''}</td>
          <td>${e.PRIORIDAD || ''}</td>
          <td>${e.ESTADO || ''}</td>
          <td>${e.CIUDAD || ''}</td>
          <td>${e.FECHA_REPORTE || ''}</td>
        </tr>
      `;

    });

    document.getElementById('tabla-reportes').innerHTML =
      filas;

  } catch (error) {

    console.error(error);

    alert('Error al cargar reporte');
  }

}