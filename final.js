// Verificar si hay un nombre de usuario en el localStorage y mostrar un mensaje de bienvenida si existe
const nombreUsuario = localStorage.getItem('nombreUsuario');
if (nombreUsuario) {
    document.getElementById('bienvenida').innerText = `¡Bienvenid@, ${nombreUsuario}!`;
    document.getElementById('cambiarUsuario').style.display = 'inline-block';
} else {
    document.getElementById('loginForm').style.display = 'block';
}

// Función para guardar el nombre de usuario en el localStorage al enviar el formulario de inicio de sesión
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const nombreUsuario = document.getElementById('nombreUsuario').value.trim();
    if (nombreUsuario) {
        localStorage.setItem('nombreUsuario', nombreUsuario);
        document.getElementById('bienvenida').innerText = `¡Bienvenid@, ${nombreUsuario}!`;
        document.getElementById('cambiarUsuario').style.display = 'inline-block';
        document.getElementById('loginForm').style.display = 'none';
    }
});

// Función para cambiar de usuario al hacer clic en el botón correspondiente
document.getElementById('cambiarUsuario').addEventListener('click', function() {
    localStorage.removeItem('nombreUsuario');
    document.getElementById('bienvenida').innerText = '';
    document.getElementById('cambiarUsuario').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';

    // Llamar a la función para borrar el historial de conversiones
    borrarHistorialConversiones();
});

function borrarHistorialConversiones() {
    localStorage.removeItem('historialConversiones');
    localStorage.removeItem('historialConversionesBaseADecimal');
    Toastify({
        text: "El historial de conversiones ha sido borrado.",
        duration: 3000, // Duración en milisegundos
        close: true, // Muestra un botón de cierre
        gravity: "top", // Posición de la notificación (top/bottom)
        position: "right", // Posición horizontal (left/center/right)
        backgroundColor: "#4CAF50", // Color de fondo
        className: "toastify-custom", // Clase CSS personalizada
        stopOnFocus: true, // Detiene el temporizador en caso de enfocar la notificación
    }).showToast();
}

// Función para guardar el historial de conversiones en el localStorage
function guardarConversion(numeroDecimal, base, resultado) {
    // Obtener el historial de conversiones del localStorage o inicializar un array vacío si no existe
    let historial = JSON.parse(localStorage.getItem('historialConversiones')) || [];
    // Agregar la nueva conversión al historial
    historial.push({
        decimal: numeroDecimal,
        base: base,
        resultado: resultado
    });
    // Guardar el historial actualizado en localStorage
    localStorage.setItem('historialConversiones', JSON.stringify(historial));
    // Mostrar la conversión en la tabla
    agregarFilaATabla('tablaDecimal', numeroDecimal, base, resultado);
}

function guardarConversionBaseADecimal(numeroB, base, resultado) {
    // Obtener el historial de conversiones del localStorage o inicializar un array vacío si no existe
    let historial = JSON.parse(localStorage.getItem('historialConversionesBaseADecimal')) || [];
    // Agregar la nueva conversión al historial
    historial.push({
        numero: numeroB,
        base: base,
        resultado: resultado
    });
    // Guardar el historial actualizado en localStorage
    localStorage.setItem('historialConversionesBaseADecimal', JSON.stringify(historial));
    // Mostrar la conversión en la tabla
    agregarFilaATabla('tablaBaseDecimal', numeroB, base, resultado);
}

function agregarFilaATabla(idTabla, valor1, valor2, resultado) {
    const tabla = document.getElementById(idTabla);
    const fila = tabla.insertRow();
    fila.insertCell(0).innerText = valor1;
    fila.insertCell(1).innerText = valor2;
    fila.insertCell(2).innerText = resultado;
    const celdaAcciones = fila.insertCell(3);
    const botonEliminar = document.createElement('button');
    botonEliminar.innerHTML = '<i class="fas fa-trash-alt"></i>';
    botonEliminar.className = 'btn btn-danger';
    botonEliminar.onclick = function() {
        eliminarFilaDeTabla(fila, idTabla);
    };
    celdaAcciones.appendChild(botonEliminar);
}

function eliminarFilaDeTabla(fila, idTabla) {
    const tabla = document.getElementById(idTabla);
    const rowIndex = fila.rowIndex;
    tabla.deleteRow(rowIndex);

    // Actualizar el localStorage
    let historial = JSON.parse(localStorage.getItem('historialConversiones')) || [];
    let historialBaseADecimal = JSON.parse(localStorage.getItem('historialConversionesBaseADecimal')) || [];
    
    if (idTabla === 'tablaDecimal') {
        historial.splice(rowIndex - 1, 1);
        localStorage.setItem('historialConversiones', JSON.stringify(historial));
    } else {
        historialBaseADecimal.splice(rowIndex - 1, 1);
        localStorage.setItem('historialConversionesBaseADecimal', JSON.stringify(historialBaseADecimal));
    }

    // Verificar si la tabla quedó vacía y eliminar el almacenamiento local si es el caso
    if (tabla.rows.length === 1) {
        if (idTabla === 'tablaDecimal') {
            localStorage.removeItem('historialConversiones');
        } else {
            localStorage.removeItem('historialConversionesBaseADecimal');
        }
    }
}


function convertirDecimal() {
    const numeroDecimal = document.getElementById("numeroDecimal").valueAsNumber;
    const base = document.getElementById("base").valueAsNumber;
    if (base < 2 || base > 36) {
        Toastify({
            text: "La base debe ser un número entre 2 y 36.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "left",
            backgroundColor: "#FF5733",
            className: "toastify-custom",
            stopOnFocus: true,
        }).showToast();
        return;
    }
    const resultado = decimalABase(numeroDecimal, base);
    document.getElementById("resultado").innerHTML = `${numeroDecimal}<sub>10</sub> = ${resultado}<sub>${base}</sub>`;
    // Guardar el resultado en localStorage
    guardarConversion(numeroDecimal, base, resultado);
    obtenerDatosCuriosos(numeroDecimal);
}

function decimalABase(decimal, base) {
    if (decimal == 0) {
        return '0';
    }
    let digitos = [];
    const simbolos = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    while (decimal > 0) {
        let resto = decimal % base;
        digitos.unshift(simbolos[resto]);
        decimal = Math.floor(decimal / base);
    }
    return digitos.join('');
}

function convertirBaseADecimal() {
    const numero2 = document.getElementById("numero2").value;
    const base2 = document.getElementById("base2").value;
    const resultado = baseADecimal(numero2, base2);
    obtenerDatosCuriosos(resultado);
    if (resultado != false) {
        document.getElementById("resultado2").innerHTML = `${numero2}<sub>${base2}</sub> = ${resultado}<sub>10</sub>`;
        // Guardar el resultado en localStorage
        guardarConversionBaseADecimal(numero2, base2, resultado);
    }
}

function baseADecimal(numero, base) {
    // Convertir un número en una base dada a su equivalente en decimal
    // Primero verifico que el numero concuerde con la base ingresada
    for (let i = 0; i < numero.length; i++) {
        let digito = numero[i];
        let valor;
        if (!isNaN(parseInt(digito))) {
            valor = parseInt(digito);
        } else {
            valor = digito.toUpperCase().charCodeAt(0) - 55;
        }
        if (valor >= base) {
            Toastify({
                text: "El numero ingresado no concuerda con la base. (El dígito excede la base)",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "left",
                backgroundColor: "#FF5733",
                className: "toastify-custom",
                stopOnFocus: true,
            }).showToast();
            return false;
        }
    }

    let numeroDecimal = 0;
    let potencia = 0;
    // Se itera a través del número de derecha a izquierda
    for (let i = numero.length - 1; i >= 0; i--) {
        let digito = numero[i];
        let valor;
        if (!isNaN(parseInt(digito))) {
            valor = parseInt(digito);
        } else {
            valor = digito.toUpperCase().charCodeAt(0) - 55; // Convertir letras a números (A=10, B=11, ..., Z=35)
        }
        // Añadir el valor del dígito multiplicado por la base elevada a la potencia
        numeroDecimal += valor * Math.pow(base, potencia);
        potencia++;
    }
    return numeroDecimal;
}

function guardarLSEnArchivo() {
    const historial = JSON.parse(localStorage.getItem('historialConversiones')) || [];
    const historialBaseADecimal = JSON.parse(localStorage.getItem('historialConversionesBaseADecimal')) || [];
    const nombreUsuario = localStorage.getItem('nombreUsuario');

    if (historial.length > 0 || historialBaseADecimal.length > 0) {
        const data = {
            nombreUsuario: nombreUsuario,
            historialConversiones: historial,
            historialConversionesBaseADecimal: historialBaseADecimal
        };

        const contenido = JSON.stringify(data);
        const blob = new Blob([contenido], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'historial_conversiones.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        borrarHistorialConversiones();
    } else {
        Toastify({
            text: "No hay datos en el localStorage para guardar.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "left",
            backgroundColor: "#FF5733",
            className: "toastify-custom",
            stopOnFocus: true,
        }).showToast();
    }
}

function obtenerDatosCuriosos(numero) {
    fetch(`http://numbersapi.com/${numero}`)
        .then(response => response.text())
        .then(data => {
            traducirTexto(data, 'es')
                .then(traduccion => {
                    //document.getElementById('datosCuriosos').innerText = "Dato Curioso sobre el numero: " + traduccion;
                    Toastify({
                        text: traduccion,
                        duration: 7000,
                        close: true,
                        gravity: "top",
                        position: "left",
                        backgroundColor: "linear-gradient(to right, #FFBF00, #9B4444)",
                        className: "toastify-custom",
                        stopOnFocus: true,
                    }).showToast();
                })
                .catch(error => console.error('Error en la traducción:', error));
        })
        .catch(error => console.error('Error en NumbersAPI:', error));
}

function traducirTexto(texto, idiomaDestino) {
    const apiKey = '0da92481-03c6-4058-9fee-789b89fe4296:fx';
    const url = `https://api-free.deepl.com/v2/translate`;
    const params = new URLSearchParams({
        auth_key: apiKey,
        text: texto,
        target_lang: idiomaDestino
    });

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            throw new Error(data.message);
        }
        return data.translations[0].text;
    });
}