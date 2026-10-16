import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

export default function CategoryButton({
  category,
  onPress,
  highlighted = false,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[
        styles.button,
        { backgroundColor: category.bgColor, borderColor: category.borderColor },
        highlighted && styles.buttonHighlighted,
      ]}
      onPress={() => onPress(category)}
    >
      <View style={[styles.iconCircle, { backgroundColor: category.color + '22' }]}>
        <Text style={styles.icon}>{category.icon}</Text>
      </View>
      <Text style={[styles.name, { color: '#333333' }]} numberOfLines={1}>
        {category.name}
      </Text>
      <Text style={[styles.actionTag, { color: category.color }]}>
        + Registrar
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 18,
    borderWidth: 1.5,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  buttonHighlighted: {
    borderColor: '#F69B42',
    borderWidth: 2.5,
    transform: [{ scale: 1.03 }],
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  icon: {
    fontSize: 26,
  },
  name: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 3,
  },
  actionTag: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
