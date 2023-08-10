// Esta función anónima inmediatamente invocada (IIFE) encapsula todo el código
(function () {
    // Declaración de variable para almacenar la referencia a la base de datos
    let DB;

    // Selecciona el formulario en la página
    const formulario = document.querySelector('#formulario');

    // Escucha el evento 'DOMContentLoaded', que se dispara cuando el documento HTML ha sido completamente cargado
    document.addEventListener('DOMContentLoaded', () => {
        // Agrega un oyente de eventos al formulario para el evento 'submit', que llama a la función 'validarCliente'
        formulario.addEventListener('submit', validarCliente);

        // Conecta con la base de datos llamando a la función 'conectarDB'
        conectarDB();
    });

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

    // Función para validar los datos del cliente en el formulario
    function validarCliente(e) {
        // Previene el comportamiento predeterminado del formulario (por ejemplo, la recarga de la página)
        e.preventDefault();

        // Obtiene los valores de los campos del formulario
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        // Comprueba si alguno de los campos está vacío y retorna si es así
        if (nombre === '' || email === '' || telefono === '' || empresa === '') {
            return;
        }

        // Crea un objeto cliente con la información recogida
        const cliente = {
            nombre,
            email,
            telefono,
            empresa
        };

        // Genera un ID único basado en la hora actual
        cliente.id = Date.now();

        // Llama a la función para crear un nuevo cliente en la base de datos
        crearNuevoCliente(cliente);
    }

    // Función para crear un nuevo cliente en la base de datos
    function crearNuevoCliente(cliente) {
        // Crea una transacción con la base de datos en modo lectura/escritura
        const transaction = DB.transaction(['crm'], 'readwrite');
        // Accede al object store 'crm'
        const objectStore = transaction.objectStore('crm');
        // Agrega el objeto cliente al object store
        objectStore.add(cliente);

        // Escucha el evento 'complete' de la transacción para confirmar que el cliente fue agregado
        transaction.oncomplete = () => {
            console.log('Cliente Agregado');
            // Muestra una alerta positiva
            imprimirAlerta('Se agregó correctamente');
            // Redirige a 'index.html' después de 3 segundos
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        };

        // Escucha el evento 'error' de la transacción para manejar errores
        transaction.onerror = () => {
            console.log('Hubo un error!');
            // Muestra una alerta de error
            imprimirAlerta('Hubo un Error', 'error');
        };
    }

    // Función para mostrar una alerta en la página
    function imprimirAlerta(mensaje, tipo) {
        // Crea un div para la alerta
        const divMensaje = document.createElement('div');
        divMensaje.classList.add("px-4", "py-3", "rounded", "max-w-lg", "mx-auto", "mt-6", "text-center");

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
})();
