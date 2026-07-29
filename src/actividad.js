const nombre = "Samuel Vanegas";
const ficha = "3412768";

const notas = [4.5, 3.8, 4.2];

const promedio = (notas[0] + notas[1] + notas[2]) / 3;

const estado = promedio >= 3 ? "Aprobado" : "No Aprobado";

console.log("================================");
console.log("      REPORTE DEL APRENDIZ      ");
console.log("================================");
console.log(`Nombre: ${nombre}`);
console.log(`Ficha: ${ficha}`);
console.log("================================");
console.log(`Promedio: ${promedio.toFixed(2)}`);
console.log(`Estado: ${estado}`);
