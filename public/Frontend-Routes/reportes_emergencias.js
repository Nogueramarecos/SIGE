let datosReporte = [];

function formatearFecha(fecha) {

  if (!fecha) return '';

  const f = new Date(fecha);

  return f.toLocaleString('es-PY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',

  });

}

async function cargarReporte(tipo) {

  try {

    const response = await fetch(`/api/reportes/${tipo}`);

    datosReporte = await response.json();

    let filas = '';

    if (datosReporte.length === 0) {

      filas = `
        <tr>
          <td colspan="6">
            No hay datos para mostrar
          </td>
        </tr>
      `;

    } else {

      datosReporte.forEach(e => {

        filas += `
          <tr>
            <td>${e.EMERGENCIA_ID}</td>
            <td>${e.TIPO || ''}</td>
            <td>${e.PRIORIDAD || ''}</td>
            <td>${e.ESTADO || ''}</td>
            <td>${e.CIUDAD || ''}</td>
            <td>${formatearFecha(e.FECHA_REPORTE)}</td>
          </tr>
        `;

      });

    }

    document.getElementById('tabla-reportes').innerHTML = filas;

  } catch (error) {

    console.error(error);

    alert('Error al cargar reporte');

  }

}

function exportarExcel() {

  if (datosReporte.length === 0) {
    alert('Primero debe cargar un reporte');
    return;
  }

  const datosExcel = datosReporte.map(e => ({
    ID: e.EMERGENCIA_ID,
    Tipo: e.TIPO || '',
    Prioridad: e.PRIORIDAD || '',
    Estado: e.ESTADO || '',
    Ciudad: e.CIUDAD || '',
    Fecha: formatearFecha(e.FECHA_REPORTE)
  }));

  const hoja = XLSX.utils.json_to_sheet(datosExcel);

  const libro = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    libro,
    hoja,
    'Reporte Emergencias'
  );

  XLSX.writeFile(
    libro,
    'reporte_emergencias.xlsx'
  );

}

function exportarPDF() {

  if (datosReporte.length === 0) {
    alert('Primero debe cargar un reporte');
    return;
  }

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(
    'SIGE - Reporte de Emergencias',
    14,
    15
  );

  doc.setFontSize(10);
  doc.text(
    'Sistema Inteligente de Gestión de Emergencias',
    14,
    22
  );

  const filas = datosReporte.map(e => [
    e.EMERGENCIA_ID,
    e.TIPO || '',
    e.PRIORIDAD || '',
    e.ESTADO || '',
    e.CIUDAD || '',
    formatearFecha(e.FECHA_REPORTE)
  ]);

  doc.autoTable({
    head: [[
      'ID',
      'Tipo',
      'Prioridad',
      'Estado',
      'Ciudad',
      'Fecha'
    ]],
    body: filas,
    startY: 30
  });

  doc.save(
    'reporte_emergencias.pdf'
  );

}