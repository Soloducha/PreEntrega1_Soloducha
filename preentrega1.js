//Funcion para pasar de Decimal a base elegida entre 2 y 10
const numeroDecimal = parseInt(prompt("Ingresa un número decimal"));
let base = parseInt(prompt("Ingresa la base")); //2 para binario, 8 para octal, 16 para hexadecimal, etc

// un IF para que el usuario ingrese un número entre 2 y 36, lo haria con un do while, pero para mostrar el uso de un IF sirve.
if (base < 2 || base > 36) {
    alert("La base debe ser un número entre 2 y 36");
    base = parseInt(prompt("Ingresa la base"));
}
console.log(`El número ${numeroDecimal} en base ${base} es: ${decimalABase(numeroDecimal, base)}`);

// Funcion que convierte binario a decimal
const numeroBinario = prompt("Ingresa un número binario"); //no hago el parseInt ahora pq no me funca el .length sino
console.log(`El número binario ${numeroBinario} en decimal es: ${binarioADecimal(numeroBinario)}`);

//Funcion que convierte decimal a base elegida
function decimalABase(decimal, base) {
    let residuos = []; //creo un array vacío
    // let digitos = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''); //base 36 como maximo, (no lo uso para usar objetos)
    const digitos = {
        0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: 'A', 11: 'B', 12: 'C',
        13: 'D', 14: 'E', 15: 'F', 16: 'G', 17: 'H', 18: 'I', 19: 'J', 20: 'K', 21: 'L', 22: 'M', 23: 'N', 24: 'O',
        25: 'P', 26: 'Q', 27: 'R', 28: 'S', 29: 'T', 30: 'U', 31: 'V', 32: 'W', 33: 'X', 34: 'Y', 35: 'Z'
    }; // OBJETO que mapea los valores de los dígitos para cada base
    
    while (decimal > 0) {        
        let residuo = decimal % base; //obtengo el residuo
        residuos.unshift(digitos[residuo]); //tomo el valor correspondiente a la pocicion del objeto de digitos
        decimal = Math.floor(decimal / base); //Redondea hacia abajo y con eso obtengo el siguiente valor para el residuo :(
    }
    const resultado = residuos.join(''); //hago el join para quitar las comas que agrego en el push
    return resultado;
}

//Funcion que convierte decimal a binario
function binarioADecimal(binario) {
    let decimal = 0;
    for (let i = binario.length - 1; i >= 0; i--) // Recorrer el número binario de derecha a izquierda
        {
            //multiplicar el binario de la posicion por 2 elevado a la posición menos 1 y sumarlo a la variable decimal total (Número decimal = enésimo bit × 2 ^ n-1)
            decimal += parseInt(binario[i]) * (2 **(binario.length - 1 - i));
        }

    return decimal;
}

//TODO: hacer el frontEnd