// Este bloque es una función autoinvocada (IIFE, por sus siglas en inglés: Immediately Invoked Function Expression). 
// Es una técnica en JavaScript que permite ejecutar funciones tan pronto como se definen.
(function () {

    // Esta variable almacenará una referencia activa a nuestra base de datos cuando esté abierta.
    let DB;

    // Seleccionamos el contenedor donde se mostrará la lista de clientes.
    const listadoClientes = document.querySelector('#listado-clientes');

    // Se añade un evento que escucha cuando todo el contenido del documento ha sido cargado.
    document.addEventListener('DOMContentLoaded', () => {
        // Intenta crear la base de datos cuando el documento esté listo.
        crearDB();

        // Verifica si la base de datos 'crm' puede ser abierta con la versión 1, luego obtiene los clientes.
        if (window.indexedDB.open('crm', 1)) {
            obtenerClientes();
        }

        // Escucha por un click en la lista de clientes para eliminar un cliente si se hace click en el enlace "Eliminar".
        listadoClientes.addEventListener('click', eliminarRegistro);
    });

    // Esta función se encarga de eliminar registros de la base de datos.
    function eliminarRegistro(e) {
        // Se verifica si el elemento al que se le hizo click tiene la clase 'eliminar'.
        if (e.target.classList.contains('eliminar')) {
            // Convierte el ID del cliente de string a número.
            const idEliminar = Number(e.target.dataset.cliente);
            
            // Pregunta al usuario si realmente desea eliminar el cliente.
            const confirmar = confirm('¿Deseas eliminar este cliente?');
            
            if (confirmar) {
                // Comienza una transacción para eliminar el cliente.
                const transaction = DB.transaction(['crm'], 'readwrite');
                const objectStore = transaction.objectStore('crm');
                objectStore.delete(idEliminar);
                
                // Si la eliminación fue exitosa, se informa y se elimina el cliente de la vista.
                transaction.oncomplete = function () {
                    console.log('Eliminado correctamente');
                    e.target.parentElement.parentElement.remove();
                }
                
                // Si hay un error, se registra en la consola.
                transaction.onerror = function () {
                    console.log('Hubo un error');
                }
            }
        }
    }

    // Esta función se encarga de crear la base de datos 'crm' si aún no existe.
    function crearDB() {
        const crearDB = window.indexedDB.open('crm', 1);

        crearDB.onerror = function () {
            console.log('Hubo un error');
        };

        crearDB.onsuccess = function () {
            DB = crearDB.result;
        };

        // Esta parte del código solo se ejecutará si es necesario crear la base de datos o actualizar su estructura.
        crearDB.onupgradeneeded = function (e) {
            const db = e.target.result;
            
            // Crea un almacén de objetos con diferentes índices para facilitar las búsquedas.
            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true });
            
            objectStore.createIndex('nombre', 'nombre', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('empresa', 'empresa', { unique: false });
            objectStore.createIndex('id', 'id', { unique: true });

            console.log('Database creada y lista');
        };
    }

    // Esta función obtiene todos los clientes de la base de datos y los muestra en el DOM.
    function obtenerClientes() {
        let abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function () {
            console.log('Hubo un error');
        };

        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result;
            const objectStore = DB.transaction('crm').objectStore('crm');
            
            // Itera sobre cada cliente en la base de datos y lo añade al DOM.
            objectStore.openCursor().onsuccess = function (e) {
                const cursor = e.target.result;

                if (cursor) {
                    const { nombre, empresa, email, telefono, id } = cursor.value;
                    
                    // Este template literal agrega un nuevo registro al DOM por cada cliente.
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
                        <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                    </td>
                </tr>
                    `;

                    cursor.continue();
                }
            };
        };
    }
})();
