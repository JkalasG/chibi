import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function SplashScreen({ onFinish }) {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1600,
      useNativeDriver: false,
    }).start(() => {
      onFinish();
    });
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoEmoji}>🐕</Text>
        </View>
        <Text style={styles.title}>MetaFin</Text>
        <Text style={styles.subtitle}>Tu Mascota Financiera Inteligente</Text>
        <Text style={styles.version}>Demo v1.0 • Bolivia</Text>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.loadingText}>Cargando datos y compañero virtual...</Text>
        <View style={styles.progressBarTrack}>
          <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    marginTop: 120,
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#EAF6F0',
    borderWidth: 3,
    borderColor: '#348C60',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#348C60',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  logoEmoji: {
    fontSize: 50,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: '#2E7D5B',
    letterSpacing: 1,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6F8C80',
    textAlign: 'center',
    marginBottom: 6,
  },
  version: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F69B42',
    letterSpacing: 0.5,
  },
  progressContainer: {
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A9992',
    marginBottom: 10,
  },
  progressBarTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5EFEA',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#348C60',
    borderRadius: 4,
  },
});
