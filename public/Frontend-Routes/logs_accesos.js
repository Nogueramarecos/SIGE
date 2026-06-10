async function cargarLogs() {

    try {

        const response =
            await fetch('/api/logs');

        const data =
            await response.json();

        const tbody =
            document.querySelector('#tablaLogs tbody');

        tbody.innerHTML = '';

        data.forEach(log => {

            tbody.innerHTML += `
                <tr>
                    <td>${log.LOG_ID}</td>
                    <td>${log.USERNAME}</td>
                    <td>${log.ROL}</td>
                    <td>${log.ACCION}</td>
                    <td>${log.FECHA_ACCESO}</td>
                    <td>${log.IP_CLIENTE}</td>
                </tr>
            `;

        });

    } catch (error) {

        console.error(error);

    }

}

cargarLogs();