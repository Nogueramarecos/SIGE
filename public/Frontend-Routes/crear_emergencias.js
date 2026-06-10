
async function guardarEmergencia() { /* Función para guardar una nueva emergencia */
  const tipo = document.getElementById('tipo').value; /* Obtener el valor del campo "tipo" */
  const prioridad = document.getElementById('prioridad').value; /* Obtener el valor del campo "prioridad" */
  const ciudad = document.getElementById('ciudad').value; /*  Obtener el valor del campo "ciudad" */
  const direccion = document.getElementById('direccion').value; /*  Obtener el valor del campo "dirección" */
  const descripcion = document.getElementById('descripcion').value; /*  Obtener el valor del campo "descripción" */

  if (!tipo || !prioridad || !ciudad || !direccion || !descripcion) { /*  Validar que todos los campos estén completos */
    mostrarMensaje('Complete todos los campos', 'error');
    return;
  }

  try { /*  Enviar los datos al servidor para crear una nueva emergencia */
    const response = await fetch('/api/emergencias', { /*  Realizar una solicitud POST a la ruta "/api/emergencias" */
      method: 'POST', /*  Especificar el método HTTP como POST */

      headers: { /* Establecer los encabezados de la solicitud */
        'Content-Type': 'application/json' /* Indicar que el cuerpo de la solicitud está en formato JSON */
      },

      body: JSON.stringify({ /* Convertir los datos del formulario a formato JSON */
        tipo,
        prioridad,
        ciudad,
        direccion,
        descripcion
      })
    });

    const data = await response.json(); /*  Esperar la respuesta del servidor y convertirla a formato JSON */
 
    if (data.success) { /*  Verificar si la respuesta indica que la emergencia se registró correctamente */
      mostrarMensaje('Emergencia registrada correctamente', 'success');
      limpiarFormulario();
    } else {
      mostrarMensaje(data.message, 'error');
    }

  } catch (error) { /* Manejar cualquier error que ocurra durante la solicitud al servidor */
    console.error(error);
    mostrarMensaje('Error al registrar emergencia', 'error');
  }
}

function limpiarFormulario() { /* Función para limpiar los campos del formulario después de guardar una emergencia */
  document.getElementById('tipo').value = '';
  document.getElementById('prioridad').value = '';
  document.getElementById('ciudad').value = '';
  document.getElementById('direccion').value = '';
  document.getElementById('descripcion').value = '';
}

function mostrarMensaje(texto, tipo) { /* Función para mostrar un mensaje al usuario después de intentar guardar una emergencia */
  const mensaje = document.getElementById('mensaje');

  mensaje.style.display = 'block';
  mensaje.className = `mensaje ${tipo}`;
  mensaje.innerHTML = texto;
}