// ============================================================================
// METAFIN - CONFIGURACIÓN DEL JUEGO Y CONSTANTES (GameConfig)
// ============================================================================

export const GAME_CONFIG = {
  BASE_XP: 10,                 // XP base por cada registro manual (gasto o ingreso)
  STREAK_BONUS_PER_DAY: 1,     // XP adicional por cada día de racha (diasRacha - 1)
  XP_PER_LEVEL: 100,           // XP fijo requerido para subir de nivel
  SAD_THRESHOLD_HOURS: 24,     // Horas sin registrar gastos para que la mascota esté triste
  VERY_SAD_THRESHOLD_HOURS: 72,// Horas para estado muy triste
  GOLDEN_STREAK_DAYS: 7,       // Umbral de días para fuego dorado en la racha
  CURRENCY: 'Bs',              // Moneda oficial: Bolivianos
  CURRENCY_CODE: 'BOB',
  DEFAULT_COUNTRY_CODE: '+591',
};

// 10 Ciudades oficiales de Bolivia para el selector de Onboarding
export const BOLIVIA_CITIES = [
  'La Paz',
  'El Alto',
  'Santa Cruz',
  'Cochabamba',
  'Oruro',
  'Potosí',
  'Sucre',
  'Tarija',
  'Beni (Trinidad)',
  'Pando (Cobija)',
];

// 4 Categorías oficiales de gasto para la Demo v1 (solo estas)
export const EXPENSE_CATEGORIES = [
  {
    id: 'FOOD',
    name: 'Alimentación',
    icon: '🍎',
    color: '#FF6B6B',
    bgColor: '#FFF0F0',
    borderColor: '#FFD1D1',
    examples: 'Comida, almuerzos, compras de mercado, restaurantes',
  },
  {
    id: 'TRANSPORT',
    name: 'Transporte',
    icon: '🚌',
    color: '#4D96FF',
    bgColor: '#F0F6FF',
    borderColor: '#D0E3FF',
    examples: 'Pasajes, minibús, teleférico, taxi, gasolina',
  },
  {
    id: 'ENTERTAINMENT',
    name: 'Entretenimiento',
    icon: '🎬',
    color: '#B983FF',
    bgColor: '#FAF5FF',
    borderColor: '#E8D7FF',
    examples: 'Cine, salidas, juegos, servicios de streaming',
  },
  {
    id: 'HEALTH',
    name: 'Salud',
    icon: '🏥',
    color: '#34A853',
    bgColor: '#F0FDF4',
    borderColor: '#C7F3D6',
    examples: 'Farmacia, consultas médicas, dentista, medicinas',
  },
];

// Etapas de evolución de la mascota según nivel
export const PET_STAGES = {
  EGG: {
    id: 'EGG',
    name: 'Huevo',
    minLevel: 1,
    maxLevel: 1,
    description: 'En etapa de incubación',
  },
  BABY: {
    id: 'BABY',
    name: 'Bebé',
    minLevel: 2,
    maxLevel: 5,
    description: 'Perrito tierno con bufanda',
  },
  JUVENILE: {
    id: 'JUVENILE',
    name: 'Juvenil',
    minLevel: 6,
    maxLevel: 10,
    description: 'Perrito ágil y activo',
  },
  LEGEND: {
    id: 'LEGEND',
    name: 'Leyenda',
    minLevel: 11,
    maxLevel: 999,
    description: 'Guardián mítico con aura dorada',
  },
};

// Periodicidades de ingreso recurrente
export const INCOME_PERIODS = [
  { id: 'WEEKLY', name: 'Semanal (7 días)', days: 7 },
  { id: 'BIWEEKLY', name: 'Quincenal (15 días)', days: 15 },
  { id: 'MONTHLY', name: 'Mensual', days: 30 },
];
