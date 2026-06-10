async function cargarAuditoria() {

    try {

        const response =
            await fetch('/api/auditoria/emergencias');

        const data =
            await response.json();

        const tbody =
            document.querySelector('#tablaAuditoria tbody');

        tbody.innerHTML = '';

        data.forEach(item => {

            tbody.innerHTML += `
                <tr>
                    <td>${item.AUDITORIA_ID}</td>
                    <td>${item.EMERGENCIA_ID}</td>
                    <td>${item.ACCION}</td>
                    <td>${item.ESTADO_ANTERIOR || ''}</td>
                    <td>${item.ESTADO_NUEVO || ''}</td>
                    <td>${item.DESCRIPCION_ANTERIOR || ''}</td>
                    <td>${item.DESCRIPCION_NUEVA || ''}</td>
                    <td>${item.FECHA_ACCION}</td>
                    <td>${item.USUARIO_BD}</td>
                </tr>
            `;

        });

    } catch (error) {

        console.error(
            'Error cargando auditoría:',
            error
        );

    }

}

cargarAuditoria();