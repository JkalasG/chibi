import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const NAV_ITEMS = [
  { key: 'DASHBOARD', label: 'Inicio', icon: '🏠' },
  { key: 'INCOME', label: 'Ingresos', icon: '💰' },
  { key: 'HISTORY', label: 'Historial', icon: '📊' },
  { key: 'HELP', label: 'Ayuda', icon: '❓' },
];

export default function BottomNavBar({ activeTab, onSelectTab }) {
  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            activeOpacity={0.8}
            style={[styles.tabBtn, isActive && styles.tabBtnActive]}
            onPress={() => onSelectTab(item.key)}
          >
            <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
              {item.icon}
            </Text>
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.5,
    borderTopColor: '#ECEAE4',
    paddingVertical: 8,
    paddingHorizontal: 10,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  tabBtn: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  tabBtnActive: {
    backgroundColor: '#EAF6F0',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
    opacity: 0.6,
  },
  tabIconActive: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A9992',
  },
  tabLabelActive: {
    color: '#2E7D5B',
    fontWeight: '800',
  },
});
