// Función para abrir la conexión con la base de datos
function conectarDB() {
    // Intenta abrir la base de datos 'crm' con la versión 1
    let abrirConexion = window.indexedDB.open('crm', 1);

    // Si hay un error al abrir la base de datos, lo registra en la consola
    abrirConexion.onerror = function () {
        console.log('Hubo un error');
    };

    // Si la base de datos se abre correctamente, guarda la referencia en la variable DB
    abrirConexion.onsuccess = function () {
        DB = abrirConexion.result;
    };
}

// Función para mostrar una alerta en la página
function imprimirAlerta(mensaje, tipo) {
    // Constante que obtiene el elemento formulario
    const alerta = document.querySelector('.alerta');
    // Comprueba si la alerta está vacía y retorna si es así
    if (!alerta) {
        // Crea un div para la alerta
        const divMensaje = document.createElement('div');
        divMensaje.classList.add("px-4", "py-3", "rounded", "max-w-lg", "mx-auto", "mt-6", "text-center", "border", "alerta");

        // Agrega clases específicas según el tipo de alerta (error o éxito)
        if (tipo === 'error') {
            divMensaje.classList.add('bg-red-100', "border-red-400", "text-red-700");
        } else {
            divMensaje.classList.add('bg-green-100', "border-green-400", "text-green-700");
        }

        // Agrega el mensaje a la alerta
        divMensaje.textContent = mensaje;

        // Inserta la alerta en el DOM dentro del formulario
        formulario.appendChild(divMensaje);

        // Elimina la alerta después de 3 segundos
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}