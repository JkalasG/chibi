import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function DialogBubble({
  text,
  onPress,
  showTapHint = false,
  highlight = false,
}) {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.8 : 1}
      onPress={onPress}
      style={[styles.container, highlight && styles.containerHighlight]}
    >
      <Text style={styles.bubbleText}>{text}</Text>
      {showTapHint && (
        <Text style={styles.tapHint}>👉 Toca para continuar</Text>
      )}
      {/* Colita del globo apuntando hacia abajo hacia la mascota */}
      <View style={styles.tail} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF9EE',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#FFE0A3',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginHorizontal: 12,
    marginBottom: 6,
    shadowColor: '#B87A00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  containerHighlight: {
    borderColor: '#F69B42',
    borderWidth: 2,
    backgroundColor: '#FFF4E5',
  },
  bubbleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A2518',
    textAlign: 'center',
    lineHeight: 18,
  },
  tapHint: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
    marginTop: 4,
  },
  tail: {
    position: 'absolute',
    bottom: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFE0A3',
  },
});
