// Esta función anónima se invoca inmediatamente después de su definición.
(function () {
    // Declaración de variable para almacenar la referencia a la base de datos
    let DB;

    // Escucha el evento 'DOMContentLoaded' que se dispara cuando el documento HTML ha sido completamente cargado
    document.addEventListener('DOMContentLoaded', () => {
        // Llama a la función para crear la base de datos
        crearDB();

        // Si se puede abrir la base de datos, llama a la función para obtener los clientes
        if (window.indexedDB.open('crm', 1)) {
            obtenerClientes();
        }
    });

    // Función para crear la base de datos IndexedDB
    function crearDB() {
        // Intenta abrir la base de datos 'crm' con la versión 1
        const crearDB = window.indexedDB.open('crm', 1);

        // Si hay un error al abrir la base de datos, lo registra en la consola
        crearDB.onerror = function () {
            console.log('Hubo un error');
        };

        // Si la base de datos se abre correctamente, guarda la referencia en la variable DB
        crearDB.onsuccess = function () {
            DB = crearDB.result;
        };

        // Este método se ejecuta solo una vez, cuando se necesita actualizar la estructura de la base de datos
        crearDB.onupgradeneeded = function (e) {
            // Obtiene una referencia a la base de datos
            const db = e.target.result;

            // Crea un "object store" llamado 'crm', con una clave primaria que se autoincrementa
            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true });

            // Define varios índices para buscar en la base de datos
            objectStore.createIndex('nombre', 'nombre', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('empresa', 'empresa', { unique: false });
            objectStore.createIndex('id', 'id', { unique: true });
            console.log('Database creada y lista');
        };
    }

    // Función para obtener los clientes de la base de datos
    function obtenerClientes() {
        // Intenta abrir la base de datos 'crm' con la versión 1
        let abrirConexion = window.indexedDB.open('crm', 1);

        // Si hay un error, lo registra en la consola
        abrirConexion.onerror = function () {
            console.log('Hubo un error');
        };

        // Si la base de datos se abre correctamente, procede a obtener los clientes
        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result;

            // Obtiene un objeto transacción para trabajar con la base de datos
            const objectStore = DB.transaction('crm').objectStore('crm');

            // Abre un cursor para iterar a través de los registros en la base de datos
            objectStore.openCursor().onsuccess = function (e) {
                const cursor = e.target.result;

                // Si el cursor no es nulo, significa que hay más registros para procesar
                if (cursor) {
                    // Desestructura los valores del registro actual
                    const { nombre, empresa, email, telefono, id } = cursor.value;

                    // Obtiene una referencia al elemento donde se mostrarán los clientes
                    const listadoClientes = document.querySelector('#listado-clientes');

                    // Agrega la información del cliente actual al HTML
                    listadoClientes.innerHTML += `
                    <tr>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                        <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                        <p class="text-gray-700">${telefono}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                        <p class="text-gray-600">${empresa}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                        <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                        <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900">Eliminar</a>
                    </td>
                </tr>
                    `;

                    // Continúa al siguiente registro en la base de datos
                    cursor.continue();
                } else {
                    // Si el cursor es nulo, hemos llegado al final de los registros
                }
            };
        };
    }
})();
