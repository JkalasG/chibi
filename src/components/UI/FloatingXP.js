import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

export default function FloatingXP({ xp = 10, onComplete = () => {} }) {
  const animY = useRef(new Animated.Value(0)).current;
  const animOpacity = useRef(new Animated.Value(0)).current;
  const animScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(animScale, {
        toValue: 1.2,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(animY, {
        toValue: -60,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.timing(animOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(onComplete);
    });
  }, [xp]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: animOpacity,
          transform: [{ translateY: animY }, { scale: animScale }],
        },
      ]}
      pointerEvents="none"
    >
      <Text style={styles.text}>+{xp} XP ✨</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '35%',
    alignSelf: 'center',
    backgroundColor: '#F69B42',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#F69B42',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 999,
  },
  text: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
