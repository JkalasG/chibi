import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GAME_CONFIG } from '../../config/gameConfig';

export default function HeaderStatus({
  streakDays = 0,
  currentXp = 0,
  level = 2,
  stage = 'Bebé',
}) {
  const isGoldenStreak = streakDays >= GAME_CONFIG.GOLDEN_STREAK_DAYS;
  const isZeroStreak = streakDays === 0;

  // Porcentaje de la barra de XP (0 a 100)
  const xpPercent = Math.min(100, Math.max(0, (currentXp / GAME_CONFIG.XP_PER_LEVEL) * 100));

  return (
    <View style={styles.container}>
      {/* Fila superior: Racha y Nivel */}
      <View style={styles.topRow}>
        {/* Badge de Racha */}
        <View
          style={[
            styles.streakBadge,
            isZeroStreak && styles.streakBadgeZero,
            isGoldenStreak && styles.streakBadgeGold,
          ]}
        >
          <Text style={styles.streakIcon}>
            {isZeroStreak ? '🔥' : isGoldenStreak ? '⚡🔥' : '🔥'}
          </Text>
          <Text
            style={[
              styles.streakText,
              isZeroStreak && styles.streakTextZero,
              isGoldenStreak && styles.streakTextGold,
            ]}
          >
            {streakDays} {streakDays === 1 ? 'Día' : 'Días'}
          </Text>
        </View>

        {/* Nivel y Etapa de la Mascota */}
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>
            Nivel {level} • <Text style={styles.stageText}>{stage}</Text>
          </Text>
        </View>
      </View>

      {/* Barra de Experiencia */}
      <View style={styles.xpBarContainer}>
        <View style={styles.xpLabelRow}>
          <Text style={styles.xpLabel}>Experiencia de crecimiento</Text>
          <Text style={styles.xpValue}>
            {currentXp} / {GAME_CONFIG.XP_PER_LEVEL} XP
          </Text>
        </View>
        <View style={styles.xpTrack}>
          <View style={[styles.xpFill, { width: `${xpPercent}%` }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#ECEAE4',
    shadowColor: '#2E7D5B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E8',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FFD2A8',
  },
  streakBadgeZero: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  streakBadgeGold: {
    backgroundColor: '#FFF9D2',
    borderColor: '#FFD700',
  },
  streakIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D96500',
  },
  streakTextZero: {
    color: '#8E8E93',
  },
  streakTextGold: {
    color: '#B37D00',
  },
  levelBadge: {
    backgroundColor: '#EAF6F0',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#C6E8D6',
  },
  levelText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#256E4A',
  },
  stageText: {
    fontWeight: '600',
    color: '#348C60',
  },
  xpBarContainer: {
    width: '100%',
  },
  xpLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  xpLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8A9992',
  },
  xpValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#256E4A',
  },
  xpTrack: {
    width: '100%',
    height: 10,
    backgroundColor: '#EAEFEA',
    borderRadius: 6,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#348C60',
    borderRadius: 6,
  },
});
