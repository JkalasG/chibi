# 01 · Visión General

## Concepto
MetaFin junta dos cosas:
1. **Control financiero personal:** registro de ingresos y gastos por categoría, con historial y resúmenes.
2. **Mascota virtual:** un perrito (Inu) que nace de un huevo y evoluciona según la constancia del usuario.

El usuario no "llena una planilla": **alimenta a su mascota**. Cada registro financiero es una interacción con el personaje, y eso crea un hábito diario por refuerzo positivo.

## Objetivos del producto
- Que el usuario registre sus gastos **todos los días**.
- Que registrar un gasto tome **2 toques** como máximo (categoría → monto → registrar).
- Que el usuario vea con claridad **cuánto ingresa y cuánto gasta** por día, semana y mes.
- Que la mascota genere un **vínculo emocional** (se pone feliz, se pone triste, evoluciona).

## Público objetivo
- Jóvenes y adultos en Bolivia (ciudades como La Paz, Santa Cruz, Cochabamba, etc.).
- Personas que reciben ingresos **quincenales o mensuales**.
- Personas a las que las apps financieras tradicionales les parecen aburridas.

## Pilares de experiencia
| Pilar | Descripción |
|-------|-------------|
| **Rapidez** | Registrar un gasto en segundos desde la pantalla principal. |
| **Recompensa inmediata** | Animación de la mascota + texto flotante `+10 XP` + barra de XP que sube. |
| **Constancia** | Las rachas diarias dan XP extra; si dejas de registrar, la mascota se entristece. |
| **Progreso visible** | La mascota evoluciona: Huevo → Bebé → Juvenil → Leyenda. |
| **Calidad visual** | Mascota 3D animada a 60 FPS, efectos de partículas y transiciones fluidas. |

## Alcance de la Demo (versión 1)
**Incluye:**
- Splash, registro/onboarding, eclosión del huevo con tutorial.
- Dashboard con la mascota 3D, racha, barra de XP y nivel.
- 4 categorías de gasto (solo estas): Alimentación, Transporte, Entretenimiento, Salud.
- Sección de Ingresos: registro manual (precargado con el ingreso por defecto) e ingreso recurrente automático (semanal / quincenal / mensual).
- Historial con filtros Día / Semana / Mes y desglose por categorías.
- Sección de Ayuda y Guía.
- 1 mascota jugable (Perrito). Otros 2 huevos visibles pero bloqueados.
- **Funciona 100 % sin conexión:** todos los datos se guardan en el teléfono, sin backend.

**No incluye (versiones futuras):**
- Backend en la nube (Firebase / Supabase), cuenta de usuario y sincronización entre dispositivos.
- Diseño visual final (dirección de arte, modelos y animaciones definitivos). En la demo se usan placeholders.
- Categorías adicionales o personalizadas.
- Mascotas adicionales (los 2 huevos bloqueados).
- Presupuestos y metas de ahorro.
- Tienda de accesorios / personalización de la mascota.
- Funciones sociales (amigos, ranking).
