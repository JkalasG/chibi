# 02 · Flujo de Pantallas y Experiencia de Usuario (UX)

## Diagrama de flujo general

```
            ┌──────────────┐
            │   Splash     │
            └──────┬───────┘
         ¿Tiene perfil creado?
          ┌────────┴────────┐
         NO                 SÍ
          │                 │
   ┌──────▼──────┐          │
   │  Registro / │          │
   │  Onboarding │          │
   └──────┬──────┘          │
   ┌──────▼──────┐          │
   │  Eclosión   │          │
   │ + Tutorial  │          │
   └──────┬──────┘          │
          └────────┬────────┘
            ┌──────▼───────┐
            │  Dashboard   │◄──┐
            └──────┬───────┘   │
      ┌────────────┼───────────┤  (Barra de navegación inferior)
 ┌────▼───┐ ┌────▼─────┐ ┌───▼───────┐ ┌──▼────┐
 │ Inicio │ │ Ingresos │ │ Historial │ │ Ayuda │
 └────────┘ └──────────┘ └───────────┘ └───────┘
```

---

## 1. Pantalla de Carga (Splash Screen)

**Elementos**
- Logo oficial de **MetaFin** en el centro.
- Barra de progreso animada en la parte inferior.

**Comportamiento**
Mientras se llena la barra, la app hace en segundo plano:
1. Inicializa servicios (base de datos local, backend, audio).
2. Precarga el modelo 3D de la mascota y sus animaciones (Addressables).
3. Verifica si hay sesión o perfil guardado:
   - **Usuario nuevo** → Pantalla de Registro.
   - **Usuario registrado** → Dashboard.
   - **Registrado pero sin eclosión completada** → Pantalla de Eclosión (retoma donde quedó).
4. Genera los **ingresos automáticos** de los periodos que pasaron y recalcula la racha y el estado de ánimo.

> En la demo todo se lee del **almacenamiento local** del teléfono (no hay sesión en la nube).

---

## 2. Registro y Configuración Inicial (Onboarding)

### Datos personales
| Campo | Tipo | Validación |
|-------|------|------------|
| Nombre completo | Texto | Obligatorio, mín. 3 caracteres |
| Alias (cómo te llama la mascota) | Texto | Obligatorio, máx. 15 caracteres |
| Correo electrónico | Texto | Formato de email válido |
| Número telefónico | Numérico + selector de código de país | Por defecto +591 (Bolivia) |
| Ciudad / Ubicación | Desplegable | La Paz, El Alto, Santa Cruz, Cochabamba, Oruro, Potosí, Sucre, Tarija, Beni (Trinidad), Pando (Cobija) |

### Datos de la mascota
- **Nombre de la mascota:** texto, obligatorio, máx. 12 caracteres.
- **Selección del huevo:**
  - Se muestran **3 huevos 3D** que giran despacio en un carrusel.
  - **Huevo del Perrito** (huella de patita en el centro): disponible y seleccionado por defecto.
  - **2 huevos bloqueados:** silueta con candado y la etiqueta *"Próximamente"*.

**Botón:** `Continuar` (se activa solo cuando todos los campos son válidos).

---

## 3. Eclosión y Activación (Nacimiento del Huevo)

El huevo se rompe cuando el usuario completa sus **primeros registros financieros**.

### Paso 1 — Registro del ingreso inicial
- **Campo:** monto del ingreso principal.
- **Periodicidad:** selector `Semanal (7 días)` | `Quincenal (15 días)` | `Mensual`.
- Este monto y esta periodicidad se guardan como **ingreso por defecto**, que después se suma automáticamente en cada periodo (ver sección 5 → Ingresos).
- **Reacción:** al guardar, el huevo **se agrieta y se sacude** (animación + partículas + sonido de crack).

### Paso 2 — Registro del primer gasto
- **Campo:** un único campo con el monto gastado hoy.
- **Categoría:** fila con los 4 íconos; **Alimentación** viene seleccionada por defecto *(propuesta)*.
- **Reacción:** al guardar, el huevo **se rompe** (VFX de explosión de luz y fragmentos), la mascota pasa a **Nivel 2 (Etapa Bebé)**, sale del huevo y **saluda con la patita**.

### Paso 3 — Tutorial rápido (burbujas de diálogo)
La mascota habla con globos de diálogo (efecto máquina de escribir; se toca para avanzar):

> 1. *"¡Hola [Alias]! Soy [NombreMascota]."*
> 2. *"Para mantenerme feliz y alimentado, registra tus gastos todos los días."*
> 3. *"Cada vez que registras algo ganas experiencia y yo crezco. ¡Si registras varios días seguidos ganas más!"*
> 4. *"Toca los botones de abajo para registrar un gasto. ¡Vamos!"*

Al terminar → Dashboard (con un resaltado sobre los botones de categoría la primera vez).

---

## 4. Pantalla Principal (Dashboard de la Mascota)

```
┌─────────────────────────────────┐
│ 🔥 5 Días        Nivel 3 · Bebé │  ← A. Estado
│ [██████░░░░] 40 / 100 XP        │
├─────────────────────────────────┤
│                                 │
│          (Mascota 3D)           │  ← B. Escena 3D
│                                 │
├─────────────────────────────────┤
│  🍎      🚌      🎬      🏥     │  ← C. Registro rápido
├─────────────────────────────────┤
│ 🏠 Inicio 💰 Ingresos 📊 Hist. ❓ │  ← Navegación
└─────────────────────────────────┘
```

### A. Sección superior (estado del jugador y la mascota)
- **Racha (Streak):** ícono de fuego (pasa a **fuego dorado** con rachas largas, ver doc 03) + número de días: `🔥 5 Días`.
- **Barra de experiencia:** `40 / 100 XP`, con animación de llenado fluida.
- **Nivel actual:** número + nombre de la etapa (Huevo / Bebé / Juvenil / Leyenda).

### B. Centro (mascota 3D animada)
Escena 3D con fondo ambientado y la mascota en tiempo real.

| Estado | Disparador | Animación |
|--------|-----------|-----------|
| **Idle** | Por defecto | Respira, parpadea, mira a la cámara, de vez en cuando mira a los lados |
| **Tap** | El usuario toca a la mascota | Saluda con la patita o mueve la cola (aleatorio) |
| **Alegría / Comer** | Se registra un gasto o ingreso | Salta / hace un gesto festivo / come |
| **Triste** | Más de 24 h sin registrar gastos | Orejas caídas, se sienta cabizbaja, colores apagados |
| **Subir de nivel** | El XP llega a 100 | Brillo, partículas, fanfarria |
| **Evolución** | Cambio de etapa (niveles 6 y 11) | Secuencia especial: destello y cambio de modelo |

### C. Sección inferior (botones de registro rápido)
| Botón | Categoría | Ejemplos |
|-------|-----------|----------|
| 🍎 | **Alimentación** | Comida, supermercado, restaurantes |
| 🚌 | **Transporte** | Pasajes, gasolina, taxi, teleférico |
| 🎬 | **Entretenimiento** | Cine, juegos, salidas, suscripciones |
| 🏥 | **Salud** | Farmacia, consultas, medicinas |

### Interacción al tocar una categoría
1. Se abre un **modal con teclado numérico rápido** (propio de la app, no el teclado del sistema) para escribir el **monto**.
2. Al presionar **"Registrar"**:
   - Se cierra el modal.
   - La mascota hace la **animación de alegría o de comida**.
   - Aparece un **texto flotante** con el XP ganado (ej. `+15 XP`).
   - La barra de XP **sube de forma fluida**.
   - Si se completan 100 XP → secuencia de **subida de nivel**.

> Los ingresos se registran desde la sección **💰 Ingresos** de la barra de navegación.

> **Categorías de gasto:** solo estas 4 en la demo. No hay "Otros" ni categorías personalizadas.

---

## 5. Barra de Navegación Inferior

Fija en todas las pantallas principales. Tiene **4 secciones**:

```
 🏠 Inicio   💰 Ingresos   📊 Historial   ❓ Ayuda
```

### 🏠 Inicio (Mascota)
Vuelve al Dashboard.

### 💰 Ingresos
**a) Registrar un ingreso manual**
- El campo **Monto** viene **precargado con el ingreso por defecto** (el que se puso en la eclosión); el usuario puede cambiarlo.
- Botón **"Registrar ingreso"** → la mascota hace la animación de alegría, aparece `+XP` y sube la barra (igual que con un gasto).
- Sirve para ingresos extra o para registrar el sueldo a mano.

**b) Ingreso recurrente (automático)**
- Muestra la configuración actual: monto por defecto, periodicidad (`Semanal` / `Quincenal` / `Mensual`) y la **fecha del próximo ingreso automático**.
- Botón **"Editar"** para cambiar el monto o la periodicidad.
- Interruptor **activar / desactivar** el ingreso automático *(propuesta)*.

**Regla del ingreso automático**
- La fecha de inicio es el día en que se registró el ingreso inicial.
- Cada vez que se cumple un periodo, la app **suma sola** un ingreso con el monto por defecto:
  - Semanal → cada 7 días.
  - Quincenal → cada 15 días.
  - Mensual → el mismo día de cada mes (si el mes no tiene ese día, por ejemplo 31, se usa el último día del mes).
- Como la demo no tiene servidor, la app lo calcula **al abrirse**: genera todos los ingresos de los periodos que pasaron desde la última vez (si estuvo cerrada 2 meses, crea los 2 ingresos mensuales que faltan).
- Al generarse, la mascota avisa con un globo de diálogo: *"¡[Alias], llegó tu ingreso de Bs [monto]! 💰"*.
- Los ingresos automáticos aparecen en el historial con la etiqueta **"Automático"**.
- No dan XP ni cuentan para la racha *(propuesta)*.

### 📊 Historial (Finanzas)
- **Filtros arriba:** `Día` | `Semana` | `Mes` (con flechas para ir a periodos anteriores).
- **Resumen:** Total Ingresado vs. Total Gastado (y saldo = ingresos − gastos).
- **Gráfico:** barras o anillo (donut) con el desglose por categorías.
- **Lista:** movimientos ordenados por fecha (categoría, monto, hora).
- Se puede deslizar un movimiento para **editarlo o eliminarlo** *(pendiente de confirmar)*.

### ❓ Ayuda y Guía de Uso
Sección interactiva en acordeón, con mini-ilustraciones de la mascota:
- ¿Cómo subir de nivel a tu mascota?
- ¿Cómo funcionan las rachas y los puntos de experiencia?
- ¿Cómo mantener feliz a tu perrito?
- Botón para **repetir el tutorial**.
