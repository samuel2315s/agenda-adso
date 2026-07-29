// ejercicio.js
// Datos del aprendiz (const: no deben cambiar durante la ejecución)
const nombreCompleto = "Samuel Vanegas";
const numeroFicha = 3412768;

// Criterio de aprobación: nota mínima 3.0 sobre una escala de 5.0
const NOTA_MINIMA_APROBACION = 3;

// Arreglo con tres calificaciones numéricas
const calificaciones = [4.2, 3.8, 1.5];

// Cálculo del promedio
const promedio = (calificaciones[0] + calificaciones[1] + calificaciones[2]) / 3;

// Determinación del estado según el criterio de aprobación
const estado = promedio >= NOTA_MINIMA_APROBACION ? "Aprobado" : "No Aprobado";

// Salida por consola usando template literals
console.log(`
===== REPORTE DE CALIFICACIONES =====
Aprendiz : ${nombreCompleto}
Ficha    : ${numeroFicha}
Notas    : ${calificaciones.join(", ")}
Promedio : ${promedio.toFixed(2)}
Estado   : ${estado}
======================================
`);