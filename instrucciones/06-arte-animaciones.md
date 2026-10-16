# 06 · Arte, Animaciones y Audio

> ⏸️ **El diseño visual todavía no se define.** Este documento solo lista **qué** assets necesita la app (requisitos funcionales), no **cómo** se verán. Para la demo se usan placeholders (formas simples, modelos de prueba).

## Modelos 3D
| Asset | Descripción |
|-------|-------------|
| Huevo Perrito | Huevo con una huella de patita en el centro; con variantes de grietas (0, 1, 2 = roto) |
| Huevos bloqueados ×2 | Silueta / material oscuro con candado |
| Inu Bebé | Perrito tierno con bufanda |
| Inu Juvenil | Más grande, proporciones atléticas |
| Inu Leyenda | Guardián, con armadura/marcas brillantes y aura mística |
| Escenario | Fondo para el Dashboard (habitación acogedora o jardín); puede cambiar según la etapa |

Formato: `.fbx` exportado desde Blender, con el **mismo esqueleto (rig)** para Bebé, Juvenil y Leyenda si es posible (así se reutilizan las animaciones).

## Animaciones de la mascota
| Clip | Uso | Loop |
|------|-----|------|
| Idle_Breathe | Estado por defecto | Sí |
| Idle_LookAround | Variación aleatoria del idle | No |
| Blink | Capa facial (parpadeo) | — |
| Tap_Wave | Saludo con la patita al tocarla | No |
| Tap_TailWag | Mover la cola al tocarla | No |
| Happy_Jump | Al registrar un movimiento | No |
| Eat | Al registrar un gasto de Alimentación (opcional por categoría) | No |
| Sad_Idle | Más de 24 h sin registrar | Sí |
| Reunion | Vuelve a estar feliz después de estar triste | No |
| LevelUp | Al subir de nivel | No |
| Hatch_Emerge | Sale del huevo | No |
| Evolve | Transición de etapa | No |

**Huevo:** `Egg_Idle`, `Egg_Shake`, `Egg_Crack`, `Egg_Break`.

## Efectos visuales (VFX)
- Grietas y fragmentos del huevo + destello de luz.
- Partículas de estrellas y confeti al subir de nivel.
- Aura mística en bucle para la etapa Leyenda.
- Fuego animado del indicador de racha (naranja / dorado).
- Texto flotante `+XP` (sube y se desvanece).
- Nube gris / lluvia ligera sobre la mascota cuando está triste (opcional).

## UI
- Logo de MetaFin (vectorial y PNG).
- Íconos: 4 categorías, navegación (Inicio, Historial, Ayuda), fuego, candado.
- Globos de diálogo con la "colita" que apunta a la mascota.
- Íconos: ingresos (💰) y etiqueta "Automático".
- Fuente: por definir (cargada como asset de TextMeshPro).

## Audio
| Tipo | Sonidos |
|------|---------|
| Música | Tema ambiental relajado en bucle (Dashboard) |
| SFX UI | Tap en botón, abrir/cerrar modal, teclas del teclado numérico |
| SFX mascota | Ladrido corto feliz, gemido triste, sonido de comer |
| SFX juego | Crack del huevo, eclosión, +XP ("ding"), subida de nivel (fanfarria), evolución |

- Opciones en Ajustes: silenciar música / silenciar efectos.
- Vibración háptica ligera al registrar un movimiento.
