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
            // Muestra una alerta de error
            imprimirAlerta('Todos los campos son obligatorios', 'error');
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
})();
