//Funcion para pasar de Decimal a base elegida entre 2 y 10
let numeroDecimal = parseInt(prompt("Ingresa un número decimal"));
let base = parseInt(prompt("Ingresa la base")); //2 para binario, 8 para octal

if (base < 2 || base > 10) {
    alert("La base debe ser un número entre 2 y 10");
    let base = parseInt(prompt("Ingresa la base"));
}
console.log(`El número ${numeroDecimal} en base ${base} es: ${decimalABase(numeroDecimal, base)}`);

// Funcion que convierte binario a decimal
let numeroBinario = prompt("Ingresa un número binario"); //no hago el parseInt ahora pq no me funca el .length sino
console.log(`El número binario ${numeroBinario} en decimal es: ${binarioADecimal(numeroBinario)}`);


function decimalABase(decimal, base) {
    let binario = '';
    while (decimal > 0) {
        binario = (decimal % base).toString() + binario; // Concatena el residuo que puede ser 1 o 0
        decimal = Math.floor(decimal / base); // Redondea hacia abajo, no me funca sin el Math.floor :(
    }
    return binario;
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

//TODO: Funcion que convierta decimal a hexadecimal
//TODO: hacer el frontEnd