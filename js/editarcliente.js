// Función anónima autoejecutable para encapsular el código
(function () {
    // Declaración de variables para almacenar la referencia a la base de datos y el ID del cliente
    let DB;
    let idCliente;

    // Seleccionando elementos del formulario por su ID
    const formulario = document.querySelector('#formulario');
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const empresaInput = document.querySelector('#empresa');
    const telefonoInput = document.querySelector('#telefono');

    // Evento que se dispara una vez que todo el contenido del documento ha sido cargado
    document.addEventListener('DOMContentLoaded', () => {
        // Conectar con la base de datos
        conectarDB();

        // Escucha el evento 'submit' del formulario y llama a la función 'actualizarCliente'
        formulario.addEventListener('submit', actualizarCliente);

        // Verifica si el cliente existe obteniendo el ID desde la URL
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');
        if (idCliente) {
            // Si el ID existe, obtiene los datos del cliente después de un retraso de 100ms
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 100);
        }
    });

    // Función para abrir la conexión con la base de datos
    function conectarDB() {
        let abrirConexion = window.indexedDB.open('crm', 1);
        abrirConexion.onerror = function () {
            console.log('Hubo un error');
        };
        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result; // Guardar la referencia de la base de datos
        };
    }

    // Función para obtener un cliente por su ID
    function obtenerCliente(id) {
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        var request = objectStore.openCursor(); // Abrir un cursor para recorrer los registros

        request.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                // Si el ID del cliente coincide, llama a la función para llenar el formulario
                if (cursor.value.id == id) {
                    llenarFormulario(cursor.value);
                }
                cursor.continue(); // Continúa al siguiente registro
            }
        };
    }

    // Función para llenar el formulario con los datos del cliente
    function llenarFormulario(datosCliente) {
        // Desestructuración del objeto para obtener los datos del cliente
        const { nombre, email, empresa, telefono } = datosCliente;
        // Rellenar los campos del formulario con los datos
        nombreInput.value = nombre;
        emailInput.value = email;
        empresaInput.value = empresa;
        telefonoInput.value = telefono;
    }

    // Función para actualizar el cliente en la base de datos
    function actualizarCliente(e) {
        e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

        // Validar que ninguno de los campos esté vacío
        if (nombreInput.value === '' || emailInput.value === '' || empresaInput.value === '' || telefonoInput.value === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        // Crear el objeto cliente con los datos actualizados
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            empresa: empresaInput.value,
            telefono: telefonoInput.value,
            id: Number(idCliente)
        };

        // Transacción para actualizar el cliente en la base de datos
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        objectStore.put(clienteActualizado); // Actualiza el registro

        transaction.oncomplete = () => {
            imprimirAlerta('Editado Correctamente'); // Alerta de éxito
            setTimeout(() => {
                window.location.href = 'index.html'; // Redirección después de 3 segundos
            }, 3000);
        };

        // Manejar cualquier error durante la transacción
        transaction.onerror = (error) => {
            console.log(error);
            console.log('Hubo un errorr.');
        };
    }

    // Función para mostrar una alerta en la página
    function imprimirAlerta(mensaje, tipo) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add("px-4", "py-3", "rounded", "max-w-lg", "mx-auto", "mt-6", "text-center");

        if (tipo === 'error') {
            divMensaje.classList.add('bg-red-100', "border-red-400", "text-red-700");
        } else {
            divMensaje.classList.add('bg-green-100', "border-green-400", "text-green-700");
        }
        divMensaje.textContent = mensaje; // Asignar el mensaje
        formulario.appendChild(divMensaje); // Insertar en el DOM

        // Quitar el alerta después de 3 segundos
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
})();
