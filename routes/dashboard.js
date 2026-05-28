async function cargarDashboard() {
  try {
    const response = await fetch('/api/dashboard/emergencias');
    const data = await response.json();

    console.log('DATOS DASHBOARD:', data);

    const total = Number(data.total || 0);
    const pendientes = Number(data.pendientes || 0);
    const resueltas = Number(data.resueltas || 0);
    const enProceso = Number(data.en_proceso || 0);

    const alta = Number(data.alta || 0);
    const media = Number(data.media || 0);
    const baja = Number(data.baja || 0);

    document.getElementById('total').textContent = total;
    document.getElementById('pendientes').textContent = pendientes;
    document.getElementById('resueltas').textContent = resueltas;
    document.getElementById('alta').textContent = alta;

    new Chart(document.getElementById('graficoEstado'), {
      type: 'pie',
      data: {
        labels: ['Pendientes', 'Resueltas', 'En proceso'],
        datasets: [{
          label: 'Emergencias',
          data: [pendientes, resueltas, enProceso],
          backgroundColor: ['#f39c12', '#27ae60', '#2980b9']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });

    new Chart(document.getElementById('graficoPrioridad'), {
      type: 'bar',
      data: {
        labels: ['Alta', 'Media', 'Baja'],
        datasets: [{
          label: 'Cantidad',
          data: [alta, media, baja],
          backgroundColor: ['#e74c3c', '#f1c40f', '#2ecc71']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });

  } catch (error) {
    console.error(error);
    alert('Error al cargar dashboard');
  }
}

cargarDashboard();