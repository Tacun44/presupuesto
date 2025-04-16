// Script para depurar la disponibilidad de window.api en el navegador
console.log('==== INICIANDO DEPURACIÓN ====');

// Función para verificar window.api
function checkWindowApi() {
  console.log('1. Verificando window.api...');
  if (window.api) {
    console.log('✅ window.api está disponible:', Object.keys(window.api));
    
    // Verificar funciones individuales
    console.log('\n2. Verificando funciones individuales:');
    const functions = [
      'getTaxes', 
      'createTax', 
      'updateTax', 
      'deleteTax', 
      'submitForm'
    ];
    
    functions.forEach(fn => {
      if (typeof window.api[fn] === 'function') {
        console.log(`✅ window.api.${fn} es una función`);
      } else {
        console.log(`❌ window.api.${fn} no está disponible o no es una función`);
      }
    });
  } else {
    console.log('❌ window.api NO está disponible!');
    console.log('Posibles causas:');
    console.log('- El archivo utils/api.js no se cargó correctamente');
    console.log('- Hay un error de sintaxis en utils/api.js que impide su ejecución');
    console.log('- La exportación window.api no se está realizando correctamente');
  }
  
  // Verificar si React está disponible
  console.log('\n3. Verificando React...');
  if (window.React) {
    console.log('✅ React está disponible, versión:', React.version);
  } else {
    console.log('❌ React NO está disponible!');
  }
  
  // Verificar otros componentes globales
  console.log('\n4. Verificando otros componentes globales:');
  const components = ['Modal', 'TaxForm', 'Taxes'];
  components.forEach(comp => {
    if (window[comp]) {
      console.log(`✅ window.${comp} está disponible`);
    } else {
      console.log(`❌ window.${comp} NO está disponible`);
    }
  });
  
  console.log('\n==== FIN DE DEPURACIÓN ====');
}

// Ejecutar después de que se cargue la página
window.addEventListener('DOMContentLoaded', () => {
  console.log('Página cargada, espero 1 segundo para verificar window.api...');
  setTimeout(checkWindowApi, 1000);
}); 