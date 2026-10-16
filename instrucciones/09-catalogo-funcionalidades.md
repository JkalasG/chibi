# 09 · Catálogo de Funcionalidades (Demo)

Lista de **todas las funcionalidades** de la app, cada una con un ID y sus criterios de aceptación (cómo se comprueba que funciona). Sirve como checklist para desarrollar y probar.

Prioridad: **P0** = imprescindible para la demo · **P1** = importante · **P2** = deseable.

---

## A. Inicio y perfil

| ID | Funcionalidad | Prioridad | Criterios de aceptación |
|----|---------------|-----------|--------------------------|
| F-01 | Splash con barra de progreso | P0 | Muestra el logo y una barra que avanza mientras carga los datos y la mascota. |
| F-02 | Decisión de ruta al iniciar | P0 | Sin perfil → Registro. Perfil sin eclosión → Eclosión (en el paso pendiente). Perfil completo → Dashboard. |
| F-03 | Formulario de registro | P0 | Campos: nombre, alias, email, teléfono (+591 por defecto), ciudad (lista de 10 ciudades), nombre de la mascota. `Continuar` solo se activa con todos los campos válidos. |
| F-04 | Validaciones | P0 | Email con formato válido; teléfono solo con números; alias de máx. 15 caracteres; nombre de la mascota de máx. 12. Los errores se muestran debajo de cada campo. |
| F-05 | Selección de huevo | P0 | 3 huevos; solo el del Perrito es seleccionable (por defecto). Al tocar uno bloqueado aparece "Próximamente". |
| F-06 | Perfil local | P0 | El perfil se guarda en el teléfono y sigue ahí después de cerrar la app. |

## B. Eclosión y tutorial

| ID | Funcionalidad | Prioridad | Criterios de aceptación |
|----|---------------|-----------|--------------------------|
| F-07 | Paso 1: ingreso inicial | P0 | Monto (> 0) + periodicidad (Semanal / Quincenal / Mensual). Se guarda como ingreso registrado **y** como ingreso por defecto recurrente. El huevo se agrieta y se sacude. |
| F-08 | Paso 2: primer gasto | P0 | Monto (> 0) + categoría (Alimentación por defecto). El huevo se rompe, la mascota sale en el Nivel 2 (Bebé) y saluda. |
| F-09 | Tutorial con globos de diálogo | P0 | 4 mensajes con el Alias y el Nombre de la mascota; se avanza tocando. Al terminar se resaltan los botones de categoría. |
| F-10 | Retomar la eclosión | P1 | Si la app se cierra a mitad de la eclosión, al volver retoma en el paso pendiente. |

## C. Dashboard y mascota

| ID | Funcionalidad | Prioridad | Criterios de aceptación |
|----|---------------|-----------|--------------------------|
| F-11 | Indicador de racha | P0 | Muestra `🔥 N Días`. Gris con 0, naranja con 1+, dorado con 7+. |
| F-12 | Barra de XP | P0 | Muestra `actual / 100 XP` y se anima al ganar XP. |
| F-13 | Nivel y etapa | P0 | Muestra el número de nivel y la etapa (Bebé 2–5, Juvenil 6–10, Leyenda 11+). |
| F-14 | Mascota en Idle | P0 | Animación de respiración en bucle mientras no pasa nada. |
| F-15 | Reacción al tocarla | P0 | Al tocar la mascota: saluda o mueve la cola (al azar). |
| F-16 | Reacción al registrar | P0 | Después de un registro: animación de alegría o de comida. |
| F-17 | Estado triste | P0 | Si pasaron más de 24 h desde el último gasto: animación triste. Al volver a registrar, se pone feliz otra vez. |
| F-18 | Subida de nivel | P0 | Al llegar a 100 XP: animación y efecto de subida de nivel; el XP sobrante pasa al siguiente nivel. |
| F-19 | Evolución | P1 | En los niveles 6 y 11: secuencia de evolución y cambio de modelo. |

## D. Registro de gastos

| ID | Funcionalidad | Prioridad | Criterios de aceptación |
|----|---------------|-----------|--------------------------|
| F-20 | 4 botones de categoría | P0 | Alimentación, Transporte, Entretenimiento, Salud. No hay más categorías. |
| F-21 | Modal con teclado numérico | P0 | Al tocar una categoría se abre un teclado propio (0–9, punto decimal, borrar) y el botón "Registrar". No acepta monto 0 ni vacío. Máx. 2 decimales. |
| F-22 | Registro en 2 toques | P0 | Categoría → monto → Registrar. Se guarda con fecha y hora local. |
| F-23 | Texto flotante +XP | P0 | Aparece `+N XP` con el valor real (10 + días de racha − 1). |

## E. Ingresos

| ID | Funcionalidad | Prioridad | Criterios de aceptación |
|----|---------------|-----------|--------------------------|
| F-24 | Sección Ingresos en el menú | P0 | 4.º ítem de la barra de navegación: 💰 Ingresos. |
| F-25 | Registro manual precargado | P0 | El campo Monto viene con el ingreso por defecto y se puede cambiar. Al registrar: da XP con el bono de racha y la mascota reacciona. |
| F-26 | Ingreso recurrente automático | P0 | Cada 7 / 15 días o cada mes (según la periodicidad), la app suma sola un ingreso con el monto por defecto. |
| F-27 | Ponerse al día al abrir | P0 | Al abrir la app (o volver del segundo plano), genera **todos** los ingresos de los periodos que pasaron. |
| F-28 | Aviso de ingreso automático | P1 | La mascota avisa con un globo: "¡Llegó tu ingreso de Bs X!". |
| F-29 | Editar el ingreso por defecto | P0 | Se pueden cambiar el monto y la periodicidad; la próxima fecha se recalcula. |
| F-30 | Activar / desactivar el automático | P2 | Interruptor que pausa los ingresos automáticos. |
| F-31 | Próxima fecha visible | P1 | Muestra "Próximo ingreso automático: dd/mm/aaaa". |

## F. Gamificación

| ID | Funcionalidad | Prioridad | Criterios de aceptación |
|----|---------------|-----------|--------------------------|
| F-32 | XP por registro | P0 | `XP = 10 + (díasRacha − 1)` en cada registro manual. |
| F-33 | Racha diaria | P0 | Sube 1 por cada día calendario consecutivo con al menos 1 gasto; si se salta un día, vuelve a empezar en 1 con el siguiente gasto. |
| F-34 | Mejor racha | P2 | Se guarda la mejor racha histórica (visible en Historial o Ayuda). |
| F-35 | Niveles | P0 | 100 XP por nivel; los niveles no se pierden. |
| F-36 | Parámetros configurables | P1 | Los valores (10, +1, 100, 24 h) están en `GameConfig` y no fijos en el código. |

## G. Historial

| ID | Funcionalidad | Prioridad | Criterios de aceptación |
|----|---------------|-----------|--------------------------|
| F-37 | Filtros Día / Semana / Mes | P0 | Cambian el periodo mostrado; las flechas navegan a periodos anteriores. |
| F-38 | Totales | P0 | Total ingresado, total gastado y saldo del periodo. |
| F-39 | Desglose por categoría | P0 | Monto y porcentaje por cada una de las 4 categorías, con un gráfico simple. |
| F-40 | Lista de movimientos | P0 | Ordenada de más reciente a más antigua; muestra tipo, categoría, monto, hora y la etiqueta "Automático" cuando corresponde. |
| F-41 | Editar / eliminar | P2 | *Pendiente de definir* (doc 08, pregunta 12). |

## H. Ayuda

| ID | Funcionalidad | Prioridad | Criterios de aceptación |
|----|---------------|-----------|--------------------------|
| F-42 | Guía en acordeón | P0 | Secciones: subir de nivel, rachas y XP, mantener feliz al perrito, ingresos automáticos. |
| F-43 | Repetir tutorial | P1 | Botón que vuelve a mostrar los globos del tutorial. |

## I. Sistema

| ID | Funcionalidad | Prioridad | Criterios de aceptación |
|----|---------------|-----------|--------------------------|
| F-44 | Funcionamiento sin conexión | P0 | Toda la app funciona sin internet. |
| F-45 | Guardado automático | P0 | Se guarda después de cada registro y al pausar o cerrar la app; no se pierden datos si se cierra a la fuerza. |
| F-46 | Notificación diaria | P1 | Recordatorio local diario: "[Mascota] tiene hambre 🐶". |
| F-47 | Aviso de racha en riesgo | P2 | Notificación a las 20:00 si aún no se registró ningún gasto ese día. |
| F-48 | Sonido y vibración | P2 | Ajustes para silenciar música, efectos y vibración. |
| F-49 | Menú de depuración | P1 | Solo en builds de desarrollo: adelantar la fecha, sumar XP, reiniciar el perfil. |
| F-50 | 60 FPS | P1 | Dashboard estable a 60 FPS en un Android de gama media. |
