async function cargarDashboard() {
  try {
    const response = await fetch('/api/dashboard/emergencias');
    const data = await response.json();

    console.log('DATOS DASHBOARD:', data);

    document.getElementById('total').textContent = data.total ?? 0;
    document.getElementById('pendientes').textContent = data.pendientes ?? 0;
    document.getElementById('resueltas').textContent = data.resueltas ?? 0;
    document.getElementById('alta').textContent = data.alta ?? 0;

    const ctxEstado = document.getElementById('graficoEstado');
    const ctxPrioridad = document.getElementById('graficoPrioridad');

    new Chart(ctxEstado, {
      type: 'pie',
      data: {
        labels: ['Pendientes', 'Resueltas', 'En proceso'],
        datasets: [{
          label: 'Emergencias',
          data: [
            data.pendientes ?? 0,
            data.resueltas ?? 0,
            data.en_proceso ?? 0
          ]
        }]
      }
    });

    new Chart(ctxPrioridad, {
      type: 'bar',
      data: {
        labels: ['Alta', 'Media', 'Baja'],
        datasets: [{
          label: 'Cantidad',
          data: [
            data.alta ?? 0,
            data.media ?? 0,
            data.baja ?? 0
          ]
        }]
      },
      options: {
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
    console.error('ERROR DASHBOARD FRONTEND:', error);
    alert('Error al cargar dashboard');
  }
}

cargarDashboard();