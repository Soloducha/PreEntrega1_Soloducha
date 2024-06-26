// Verificar si hay un nombre de usuario en el localStorage y mostrar un mensaje de bienvenida si existe
const nombreUsuario = localStorage.getItem('nombreUsuario');
if (nombreUsuario) {
    document.getElementById('bienvenida').innerText = `Bienvenid@, ${nombreUsuario}!`;
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
        document.getElementById('bienvenida').innerText = `Bienvenido, ${nombreUsuario}!`;
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
}

function guardarConversionBaseADecimal(numeroB, base, resultado) {
    // Obtener el historial de conversiones del localStorage o inicializar un array vacío si no existe
    let historial = JSON.parse(localStorage.getItem('historialConversionesBaseADecimal')) || [];
    // Agregar la nueva conversión al historial
    historial.push({
        decimal: numeroB,
        base: base,
        resultado: resultado
    });
    // Guardar el historial actualizado en localStorage
    localStorage.setItem('historialConversionesBaseADecimal', JSON.stringify(historial));
}
function convertirDecimal() {
    const numeroDecimal = document.getElementById("numeroDecimal").valueAsNumber;
    let base = document.getElementById("base").valueAsNumber;
    if (base < 2 || base > 36 || isNaN(base)) {
        document.getElementById("resultado").innerText = "La base debe ser un número entre 2 y 36";
        return;
    }
    const resultado = decimalABase(numeroDecimal, base);
    document.getElementById("resultado").innerHTML = `${numeroDecimal}<sub>10</sub> = ${resultado}<sub>${base}</sub>`;
    // Guardar el resultado en localStorage
    guardarConversion(numeroDecimal, base, resultado);
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
    const resultado = baseADecimal(numero2,base2);
    if (resultado != false) {
        document.getElementById("resultado2").innerHTML = `${numero2}<sub>${base2}</sub> = ${resultado}<sub>10</sub>`;
        // Guardar el resultado en localStorage
        guardarConversionBaseADecimal(numero2, base2, resultado); 
    }
}

function binarioADecimal(binario) {
let decimal = 0;
for (let i = binario.length - 1; i >= 0; i--) // Recorrer el número binario de derecha a izquierda
    {
        //multiplicar el binario de la posicion por 2 elevado a la posición menos 1 y sumarlo a la variable decimal total (Número decimal = enésimo bit × 2 ^ n-1)
        decimal += parseInt(binario[i]) * (2 **(binario.length - 1 - i));
    }
return decimal;
}

function baseADecimal(numero, base) {
    // Convertir un número en una base dada a su equivalente en decimal
    // Primero verifico que el numero concuerde con la base ingresada
    for (let i = 0; i < numero.length; i++) {
        console.log(numero,base)
        let digito = numero[i];
        let valor;
        if (!isNaN(parseInt(digito))) {
            valor = parseInt(digito);
        } else {
            valor = digito.toUpperCase().charCodeAt(0) - 55;
        }
        if (valor >= base) {
            alert("El numero ingresado no concuerde con la base. (El dígito excede la base)");
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
        alert('No hay datos en el localStorage para guardar.');
    }
}