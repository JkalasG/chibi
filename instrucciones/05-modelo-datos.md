# 05 · Modelo de Datos

## Diagrama de entidades

```
User 1───1 Pet
User 1───* Transaction *───0..1 Category
User 1───1 Streak
User 1───1 RecurringIncome
```

> **Demo:** todas las entidades se guardan en un solo archivo `metafin_save.json` en el teléfono, con un campo `schema_version` para migraciones futuras.

## User (Usuario)
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID | Clave primaria (se genera en el teléfono) |
| full_name | string | |
| alias | string | Cómo lo llama la mascota |
| email | string | Único |
| phone_country_code | string | ej. "+591" |
| phone_number | string | |
| city | string | De la lista de ciudades |
| currency | string | ej. "BOB" |
| onboarding_step | enum | `REGISTER`, `HATCH_INCOME`, `HATCH_EXPENSE`, `TUTORIAL`, `DONE` |
| created_at | timestamp | |

## Pet (Mascota)
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID | |
| user_id | UUID | FK → User |
| name | string | |
| species | enum | `DOG` (futuro: otras especies) |
| level | int | 1 = Huevo |
| current_xp | int | 0–99 dentro del nivel actual |
| total_xp | int | XP acumulado total |
| stage | enum | `EGG`, `BABY`, `JUVENILE`, `LEGEND` (se deriva del nivel) |
| mood | enum | `HAPPY`, `SAD`, `VERY_SAD` (se deriva de la última fecha de registro) |
| hatched_at | timestamp | |

## Transaction (Movimiento)
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID | Se genera en el cliente (para trabajar offline) |
| user_id | UUID | FK |
| type | enum | `INCOME` / `EXPENSE` |
| category_id | string? | Solo en gastos: `FOOD`, `TRANSPORT`, `ENTERTAINMENT`, `HEALTH` |
| source | enum | `MANUAL` / `AUTO` (ingreso recurrente) |
| amount | decimal(12,2) | > 0 |
| note | string? | Opcional (futuro) |
| occurred_at | timestamp | Fecha y hora local del movimiento |
| xp_awarded | int | XP que dio el registro (para auditoría) |
| created_at / updated_at | timestamp | |
| deleted | bool | Borrado lógico (para la sincronización) |
| sync_status | enum | `PENDING`, `SYNCED` (reservado para cuando exista el backend) |

## RecurringIncome (Ingreso por defecto / recurrente)
| Campo | Tipo | Notas |
|-------|------|-------|
| user_id | UUID | PK/FK |
| amount | decimal(12,2) | Monto por defecto (se precarga en la pantalla Ingresos) |
| period | enum | `WEEKLY` (7 días) / `BIWEEKLY` (15 días) / `MONTHLY` |
| start_date | date | Día del ingreso inicial (en la eclosión) |
| next_date | date | Próxima fecha de suma automática |
| enabled | bool | Activar / desactivar el ingreso automático |

## Category (Categoría) — estática en ScriptableObjects + tabla espejo
| id | Nombre | Ícono | Color sugerido |
|----|--------|-------|----------------|
| FOOD | Alimentación | 🍎 | #FF6B6B |
| TRANSPORT | Transporte | 🚌 | #4D96FF |
| ENTERTAINMENT | Entretenimiento | 🎬 | #B983FF |
| HEALTH | Salud | 🏥 | #6BCB77 |

## Streak (Racha)
| Campo | Tipo | Notas |
|-------|------|-------|
| user_id | UUID | PK/FK |
| current_days | int | |
| best_days | int | Mejor racha histórica |
| last_expense_date | date | Fecha local del último día con gasto registrado |

### Lógica de actualización de la racha
```
hoy = fechaLocal()
si last_expense_date == hoy        → no cambia
si last_expense_date == hoy − 1    → current_days += 1
si no                              → current_days = 1
last_expense_date = hoy
best_days = max(best_days, current_days)
```
Al abrir la app: si `hoy − last_expense_date > 1` → la racha se muestra en 0.

## Consultas del Historial
- **Día / Semana / Mes:** `SUM(amount) GROUP BY type, category_id WHERE occurred_at BETWEEN inicio AND fin`.
- La semana empieza el lunes *(propuesta)*.
