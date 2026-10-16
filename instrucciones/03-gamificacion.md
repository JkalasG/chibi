# 03 · Lógica de Gamificación

## 1. Sistema de Experiencia (XP)

| Regla | Valor |
|-------|-------|
| XP base por registro manual (gasto o ingreso) | **10 XP** (+ bono de racha) |
| XP por ingreso automático (recurrente) | **0 XP** *(propuesta: no es una acción del usuario)* |
| XP necesario para subir de nivel | **100 XP** por nivel (fijo) |
| XP sobrante al subir de nivel | Pasa al siguiente nivel (ej. 105 XP → Nivel +1 con 5/100) |

> ⚠️ Pendiente: ¿la curva de XP se queda en 100 fijo o aumenta en niveles altos? Ver doc 08.

## 2. Racha Diaria (Streak)

### Definición
- Un **día cuenta para la racha** si el usuario registra **al menos 1 gasto** ese día (según la hora local del teléfono).
- Si pasa un día calendario completo sin registrar un gasto, la racha **vuelve a 0**.

### Bono por racha ✅ (definido)
Cada día de racha suma **+1 XP** al valor de **cada registro**:

```
bonoRacha   = diasRacha − 1
XP_registro = 10 + bonoRacha
```

| Día de racha | XP por registro |
|--------------|-----------------|
| 1 | 10 |
| 2 | 11 |
| 3 | 12 |
| 4 | 13 |
| 10 | 19 |
| 30 | 39 |

- El bono se aplica a **todos los registros manuales** del día (gastos e ingresos).
- Si la racha se rompe, vuelve al día 1 (10 XP por registro).
- El valor `+1` se guarda en `GameConfig` para poder ajustarlo después.

### Indicador visual de la racha
| Racha | Ícono |
|-------|-------|
| 0 días | Fuego gris / apagado |
| 1–6 días | 🔥 Fuego naranja |
| 7+ días | 🔥 Fuego dorado con partículas *(umbral propuesto)* |

## 3. Niveles y Evolución de la Mascota

| Nivel | Etapa | Apariencia |
|-------|-------|------------|
| 1 | **Huevo** | Huevo con una huella de patita (fase de configuración) |
| 2 – 5 | **Bebé** | Perrito tierno con bufanda |
| 6 – 10 | **Juvenil** | Perrito más grande, activo y ágil |
| 11+ | **Leyenda** | Perrito guardián con efectos mágicos / místicos (aura, partículas) |

- Al pasar de Bebé a Juvenil (nivel 6) y de Juvenil a Leyenda (nivel 11) se reproduce una **secuencia de evolución** especial.
- La eclosión (Nivel 1 → 2) ocurre al completar el **ingreso inicial + el primer gasto**, sin importar el XP.

> ⚠️ Pendiente: ¿con cuánto XP arranca el usuario en el Nivel 2? (propuesta: 0/100). Ver doc 08.

## 4. Estado de Ánimo de la Mascota

| Estado | Condición |
|--------|-----------|
| **Feliz** | Registró un gasto en las últimas 24 h |
| **Triste** | Más de 24 h sin registrar gastos |
| **Muy triste** *(propuesta)* | Más de 72 h sin registrar |

- La mascota **nunca muere ni pierde niveles** (para no castigar ni frustrar al usuario). *Propuesta, pendiente de confirmar.*
- Al volver a registrar, la mascota recupera la felicidad con una animación de reencuentro.

## 5. Notificaciones (propuesta)
- Recordatorio diario a una hora configurable: *"[NombreMascota] tiene hambre 🐶 ¿Registraste tus gastos de hoy?"*
- Aviso de racha en riesgo (ej. a las 20:00 si aún no registró nada ese día).
