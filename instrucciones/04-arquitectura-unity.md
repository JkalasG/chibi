# 04 · Arquitectura Técnica en Unity

## 1. Decisión de motor
La especificación original proponía Flutter + Unity embebido. Se decide hacer **toda la app en Unity** porque:
- Hay un solo proyecto y un solo lenguaje (C#).
- La mascota 3D, la UI y las transiciones comparten el mismo render → no hay parpadeos ni demoras al pasar entre Flutter y Unity.
- Hay control total sobre VFX, iluminación, post-procesado y animación.

**Desventaja a tener en cuenta:** las pantallas tipo formulario (registro, historial) requieren más trabajo que en un framework de UI nativo, y el APK pesa más (~40–80 MB).

## 2. Stack recomendado

| Área | Tecnología |
|------|-----------|
| Motor | **Unity 6 LTS** |
| Render | **URP** (Universal Render Pipeline), perfil móvil |
| UI | **uGUI + TextMeshPro** (o UI Toolkit para pantallas de formularios) |
| Animación UI | **DOTween** (tweens de barras, modales, textos flotantes) |
| Animación mascota | **Animator** (Mecanim) con Blend Trees y capas |
| VFX | **Particle System** / VFX Graph (Shuriken es más compatible con móviles) |
| Carga de recursos | **Addressables** |
| Entrada | **Input System** (toques) |
| Persistencia local | **JSON en `Application.persistentDataPath`** (demo); migrable a SQLite |
| Backend | **No hay en la demo.** A futuro: Firebase (recomendado por su SDK oficial para Unity) o Supabase |
| Gráficos (historial) | Gráficos propios con UI, o un asset como *XCharts* |
| Notificaciones locales | Paquete **Mobile Notifications** de Unity |
| Analítica (opcional) | Firebase Analytics / Unity Analytics |

> ✅ **Demo sin backend:** el registro crea un perfil **solo local** (sin contraseña ni login). La capa de datos usa interfaces (`IUserRepository`, `ITransactionRepository`, etc.) para poder conectar un backend después sin reescribir la lógica.

## 3. Estructura de carpetas del proyecto Unity

```
Assets/
├── _Project/
│   ├── Scenes/
│   │   ├── 00_Boot.unity          (Splash + inicialización)
│   │   ├── 01_Onboarding.unity    (Registro + selección de huevo)
│   │   ├── 02_Hatching.unity      (Eclosión + tutorial)
│   │   └── 03_Main.unity          (Dashboard + Historial + Ayuda)
│   ├── Scripts/
│   │   ├── Core/          (GameManager, SceneLoader, ServiceLocator, EventBus)
│   │   ├── Data/          (Modelos, Repositorios, SaveSystem, SyncService)
│   │   ├── Gamification/  (XPSystem, StreakSystem, LevelSystem, MoodSystem)
│   │   ├── Pet/           (PetController, PetAnimator, PetEvolution, PetInteraction)
│   │   ├── Finance/       (TransactionService, RecurringIncomeService, CategoryConfig, ReportService)
│   │   ├── UI/
│   │   │   ├── Screens/   (SplashScreen, RegisterScreen, DashboardScreen, IncomeScreen, HistoryScreen, HelpScreen)
│   │   │   ├── Widgets/   (XPBar, StreakBadge, NumPad, FloatingText, DialogBubble)
│   │   │   └── Navigation/(BottomNavBar, ScreenRouter)
│   │   └── Services/      (NotificationService, AudioService, ClockService)
│   ├── ScriptableObjects/
│   │   ├── Categories/    (Alimentacion.asset, Transporte.asset, ...)
│   │   ├── PetStages/     (Huevo.asset, Bebe.asset, Juvenil.asset, Leyenda.asset)
│   │   └── GameConfig.asset (XP base, XP por nivel, bono de racha, horas para "triste")
│   ├── Art/
│   │   ├── Models/  Textures/  Materials/  Animations/  VFX/  UI/  Fonts/
│   └── Audio/
│       ├── Music/  SFX/
├── Plugins/
└── AddressableAssetsData/
```

## 4. Sistemas principales

### GameManager
Singleton persistente (`DontDestroyOnLoad`). Orquesta la carga de servicios y decide la escena inicial.

### EventBus (desacoplamiento)
Eventos globales:
- `OnTransactionRegistered(Transaction t)`
- `OnXPGained(int amount)`
- `OnLevelUp(int newLevel)`
- `OnStageEvolved(PetStage newStage)`
- `OnStreakChanged(int days)`
- `OnMoodChanged(PetMood mood)`

La UI y la mascota **escuchan** eventos; la lógica de gamificación los **emite**. Así la lógica no depende de lo visual.

### Flujo al registrar un gasto
```
NumPad → TransactionService.Register(categoria, monto)
       → Repositorio guarda localmente (y encola la sincronización)
       → StreakSystem.Update(fecha)
       → XPSystem.Grant(10 + (diasRacha − 1))
              → LevelSystem.Check() → OnLevelUp / OnStageEvolved
       → MoodSystem.SetHappy()
       → EventBus → PetAnimator.Play("Happy"), FloatingText("+15 XP"), XPBar.AnimateTo()
```

### RecurringIncomeService (ingreso automático)
Se ejecuta al abrir la app y al volver del segundo plano (`OnApplicationPause(false)`):
```
mientras proximaFecha <= hoy:
    crear Transaction(INCOME, monto_por_defecto, occurred_at = proximaFecha, source = AUTO)
    proximaFecha = proximaFecha + periodo   // 7 días, 15 días o 1 mes
guardar proximaFecha
```

### Configuración por ScriptableObjects
Todos los números del juego (10 XP base, +1 XP por día de racha, 100 XP por nivel, 24 h para estar triste) viven en `GameConfig.asset`, para poder ajustarlos sin tocar código.

### Persistencia local (demo)
- Todo se guarda en el teléfono; la app funciona sin internet.
- Se guarda en disco después de cada registro y al pausar o cerrar la app.
- La racha y los ingresos automáticos se calculan con la **fecha local del dispositivo** (`ClockService`, que también permite simular fechas en las pruebas).
- A futuro: un `SyncService` subirá los cambios cuando exista el backend.

## 5. Rendimiento (objetivo: 60 FPS estables)
- Mascota: ≤ 15k triángulos por etapa, 1 material con atlas de texturas (1024–2048 px).
- Usar shader **toon/cel shading** ligero para URP.
- `Application.targetFrameRate = 60`.
- Bajar a 30 FPS cuando la pantalla de Historial o Ayuda está activa y la mascota no se ve (ahorro de batería).
- Partículas con un número máximo limitado; evitar post-procesado pesado en gamas bajas (perfil de calidad por dispositivo).
- Probar en un Android de gama media/baja (2 GB de RAM).

## 6. Seguridad y privacidad
- Los datos financieros son sensibles: cifrar el archivo local (AES) *(opcional en la demo)*.
- Cuando exista el backend: HTTPS y reglas de seguridad para que cada usuario solo acceda a sus propios datos.
- Agregar una pantalla de **política de privacidad** y de consentimiento (obligatorio en Google Play y App Store).
