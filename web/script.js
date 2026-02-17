/**
 * @returns {number} El año actual de 4 dígitos.
 */
function getCurrentYear() {
  return new Date().getFullYear();
}

const year = getCurrentYear();

// Actualiza el año de la política de privacidad
document.getElementById(
  'last-updated',
).textContent = `Última actualización: 26 de enero de ${year}`;

// Actualiza el año del copyright en el footer
document.getElementById(
  'copyright-text',
).innerHTML = `&copy; ${year} Gaelectronica - Temperatura App. Todos los derechos reservados.`;
