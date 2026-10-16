import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { EXPENSE_CATEGORIES, GAME_CONFIG } from '../config/gameConfig';

export default function HistoryScreen({
  transactions = [],
  onDeleteTransaction,
}) {
  const [filterMode, setFilterMode] = useState('MONTH'); // 'DAY' | 'WEEK' | 'MONTH'
  const [offsetPeriods, setOffsetPeriods] = useState(0); // 0 = actual, -1 = anterior, etc.

  // Cálculo de rango de fechas según filterMode y offsetPeriods
  const { startDate, endDate, periodLabel } = useMemo(() => {
    const now = new Date();

    if (filterMode === 'DAY') {
      const d = new Date(now);
      d.setDate(d.getDate() + offsetPeriods);
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);

      const isToday = offsetPeriods === 0;
      const isYesterday = offsetPeriods === -1;
      const label = isToday
        ? 'Hoy'
        : isYesterday
        ? 'Ayer'
        : d.toLocaleDateString('es-BO', { day: 'numeric', month: 'short' });

      return { startDate: start, endDate: end, periodLabel: label };
    }

    if (filterMode === 'WEEK') {
      const d = new Date(now);
      // Ajustar al lunes de la semana actual
      const dayOfWeek = d.getDay();
      const distanceToMonday = (dayOfWeek + 6) % 7;
      d.setDate(d.getDate() - distanceToMonday + offsetPeriods * 7);

      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 6, 23, 59, 59);

      const label = `Semana ${start.getDate()} ${start.toLocaleDateString('es-BO', { month: 'short' })} - ${end.getDate()} ${end.toLocaleDateString('es-BO', { month: 'short' })}`;
      return { startDate: start, endDate: end, periodLabel: label };
    }

    // MONTH
    const d = new Date(now);
    d.setMonth(d.getMonth() + offsetPeriods);
    const start = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

    const label = d.toLocaleDateString('es-BO', { month: 'long', year: 'numeric' });
    const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);
    return { startDate: start, endDate: end, periodLabel: capitalizedLabel };
  }, [filterMode, offsetPeriods]);

  // Filtrar transacciones dentro del rango
  const filteredList = useMemo(() => {
    return transactions.filter((tx) => {
      const txDate = new Date(tx.occurred_at || tx.created_at);
      return txDate >= startDate && txDate <= endDate;
    });
  }, [transactions, startDate, endDate]);

  // Totales
  const totalIncome = useMemo(() => {
    return filteredList
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
  }, [filteredList]);

  const totalExpense = useMemo(() => {
    return filteredList
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
  }, [filteredList]);

  const balance = totalIncome - totalExpense;

  // Desglose por categoría de gastos
  const categoryBreakdown = useMemo(() => {
    const expenses = filteredList.filter((t) => t.type === 'EXPENSE');
    return EXPENSE_CATEGORIES.map((cat) => {
      const catTotal = expenses
        .filter((t) => t.category_id === cat.id)
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
      const percent = totalExpense > 0 ? (catTotal / totalExpense) * 100 : 0;
      return {
        ...cat,
        total: catTotal,
        percent,
      };
    });
  }, [filteredList, totalExpense]);

  const handleDelete = (tx) => {
    Alert.alert(
      'Eliminar Movimiento',
      `¿Deseas eliminar este movimiento de Bs ${tx.amount.toFixed(2)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDeleteTransaction(tx.id),
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 Historial Financiero</Text>
        <Text style={styles.headerSubtitle}>
          Analiza tus gastos, ingresos y saldo acumulado
        </Text>
      </View>

      {/* FILTROS DÍA / SEMANA / MES */}
      <View style={styles.filterPillsRow}>
        {[
          { key: 'DAY', label: 'Día' },
          { key: 'WEEK', label: 'Semana' },
          { key: 'MONTH', label: 'Mes' },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.filterPill, filterMode === item.key && styles.filterPillActive]}
            onPress={() => {
              setFilterMode(item.key);
              setOffsetPeriods(0);
            }}
          >
            <Text style={[styles.filterPillText, filterMode === item.key && styles.filterPillTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* NAVEGADOR DE PERIODOS (< label >) */}
      <View style={styles.periodNavRow}>
        <TouchableOpacity
          style={styles.navArrowBtn}
          onPress={() => setOffsetPeriods((p) => p - 1)}
        >
          <Text style={styles.navArrowText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.periodNavLabel}>{periodLabel}</Text>

        <TouchableOpacity
          style={[styles.navArrowBtn, offsetPeriods >= 0 && styles.navArrowBtnDisabled]}
          disabled={offsetPeriods >= 0}
          onPress={() => setOffsetPeriods((p) => p + 1)}
        >
          <Text style={[styles.navArrowText, offsetPeriods >= 0 && styles.navArrowTextDisabled]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* TARJETA DE RESUMEN: INGRESOS, GASTOS, SALDO */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryCol}>
          <Text style={styles.summaryLabel}>Total Ingresado</Text>
          <Text style={styles.incomeValue}>+Bs {totalIncome.toFixed(2)}</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryCol}>
          <Text style={styles.summaryLabel}>Total Gastado</Text>
          <Text style={styles.expenseValue}>-Bs {totalExpense.toFixed(2)}</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryCol}>
          <Text style={styles.summaryLabel}>Saldo Neto</Text>
          <Text style={[styles.balanceValue, balance < 0 && styles.balanceNegative]}>
            Bs {balance.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* DESGLOSE POR CATEGORÍAS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🍩 Desglose por Categoría</Text>
        {totalExpense === 0 ? (
          <Text style={styles.emptyNotice}>No hay gastos registrados en este período.</Text>
        ) : (
          categoryBreakdown.map((cat) => (
            <View key={cat.id} style={styles.catProgressItem}>
              <View style={styles.catProgressLabelRow}>
                <View style={styles.catNameWithIcon}>
                  <Text style={styles.catIcon}>{cat.icon}</Text>
                  <Text style={styles.catName}>{cat.name}</Text>
                </View>
                <Text style={styles.catAmount}>
                  Bs {cat.total.toFixed(2)} ({cat.percent.toFixed(0)}%)
                </Text>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(100, cat.percent)}%`,
                      backgroundColor: cat.color,
                    },
                  ]}
                />
              </View>
            </View>
          ))
        )}
      </View>

      {/* LISTA DE MOVIMIENTOS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          📋 Movimientos del Período ({filteredList.length})
        </Text>

        {filteredList.length === 0 ? (
          <Text style={styles.emptyNotice}>No hay movimientos registrados.</Text>
        ) : (
          filteredList.map((tx) => {
            const isIncome = tx.type === 'INCOME';
            const cat = EXPENSE_CATEGORIES.find((c) => c.id === tx.category_id);
            const dateObj = new Date(tx.occurred_at || tx.created_at);
            const timeStr = dateObj.toLocaleTimeString('es-BO', {
              hour: '2-digit',
              minute: '2-digit',
            });
            const dateStr = dateObj.toLocaleDateString('es-BO', {
              day: 'numeric',
              month: 'short',
            });

            return (
              <View key={tx.id} style={styles.txRow}>
                <View style={styles.txLeft}>
                  <View
                    style={[
                      styles.txIconBox,
                      { backgroundColor: isIncome ? '#EAF6F0' : cat?.bgColor || '#FFF0F0' },
                    ]}
                  >
                    <Text style={styles.txIcon}>
                      {isIncome ? '💰' : cat?.icon || '💸'}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.txTitleRow}>
                      <Text style={styles.txTitle}>
                        {isIncome ? 'Ingreso' : cat?.name || 'Gasto'}
                      </Text>
                      {tx.source === 'AUTO' && (
                        <Text style={styles.autoTag}>Automático</Text>
                      )}
                    </View>
                    <Text style={styles.txMeta}>
                      {dateStr} • {timeStr} {tx.note ? `• ${tx.note}` : ''}
                    </Text>
                  </View>
                </View>

                <View style={styles.txRight}>
                  <Text style={[styles.txAmount, isIncome ? styles.txAmountIncome : styles.txAmountExpense]}>
                    {isIncome ? '+' : '-'}Bs {parseFloat(tx.amount).toFixed(2)}
                  </Text>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(tx)}
                  >
                    <Text style={styles.deleteBtnText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#FDFBF7',
  },
  header: {
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2E7D5B',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#7A8C84',
  },
  filterPillsRow: {
    flexDirection: 'row',
    backgroundColor: '#EFECE6',
    borderRadius: 14,
    padding: 4,
    marginBottom: 12,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  filterPillActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
  },
  filterPillTextActive: {
    color: '#2E7D5B',
    fontWeight: '800',
  },
  periodNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ECEAE4',
  },
  navArrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3EFEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrowBtnDisabled: {
    opacity: 0.35,
  },
  navArrowText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2E7D5B',
    marginTop: -2,
  },
  navArrowTextDisabled: {
    color: '#A0AAB0',
  },
  periodNavLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#333',
  },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#ECEAE4',
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#F0EFEA',
    alignSelf: 'center',
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#888',
    marginBottom: 4,
    textAlign: 'center',
  },
  incomeValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#348C60',
  },
  expenseValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#E53935',
  },
  balanceValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#2563EB',
  },
  balanceNegative: {
    color: '#E53935',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#ECEAE4',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4A2518',
    marginBottom: 12,
  },
  emptyNotice: {
    fontSize: 12,
    color: '#8A9992',
    textAlign: 'center',
    paddingVertical: 16,
    fontStyle: 'italic',
  },
  catProgressItem: {
    marginBottom: 12,
  },
  catProgressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  catNameWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  catName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
  catAmount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
  },
  progressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#F0EFEA',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F3EF',
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  txIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  txIcon: {
    fontSize: 18,
  },
  txTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#222',
  },
  autoTag: {
    fontSize: 9,
    fontWeight: '800',
    backgroundColor: '#EAF6F0',
    color: '#2E7D5B',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginLeft: 6,
  },
  txMeta: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  txRight: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  txAmount: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  txAmountIncome: {
    color: '#348C60',
  },
  txAmountExpense: {
    color: '#E53935',
  },
  deleteBtn: {
    padding: 3,
  },
  deleteBtnText: {
    fontSize: 12,
  },
});
