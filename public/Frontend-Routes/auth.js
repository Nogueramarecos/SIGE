function verificarSesion() {
  const usuario = localStorage.getItem('usuario');
  const rol = localStorage.getItem('rol');

  if (!usuario || !rol) {
    window.location.href = 'login.html';
  }
}

function cerrarSesion() {
  localStorage.removeItem('usuario');
  localStorage.removeItem('rol');

  window.location.href = 'login.html';
}

function permitirRoles(rolesPermitidos) {
  const rol = localStorage.getItem('rol');

  if (!rol || !rolesPermitidos.includes(rol)) {
    alert('No tiene permisos para acceder a esta sección');
    window.location.href = 'menu.html';
  }
}