import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { GAME_CONFIG, INCOME_PERIODS } from '../config/gameConfig';
import NumPadModal from '../components/UI/NumPadModal';

export default function IncomeScreen({
  data,
  onRegisterManualIncome,
  onUpdateRecurringIncome,
}) {
  const recurring = data?.recurring_income || {
    amount: 2500,
    period: 'MONTHLY',
    enabled: true,
    next_date: '2026-11-01',
  };

  const streakDays = data?.streak?.current_days || 0;
  const streakBonus = Math.max(0, streakDays - 1);
  const xpReward = GAME_CONFIG.BASE_XP + streakBonus;

  // Estados locales
  const [isNumPadVisible, setIsNumPadVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Estados de edición del ingreso recurrente
  const [editAmount, setEditAmount] = useState(String(recurring.amount || 2500));
  const [editPeriod, setEditPeriod] = useState(recurring.period || 'MONTHLY');
  const [isEnabled, setIsEnabled] = useState(recurring.enabled ?? true);

  const currentPeriodObj =
    INCOME_PERIODS.find((p) => p.id === recurring.period) || INCOME_PERIODS[2];

  const handleManualIncomeSubmit = ({ amount, note }) => {
    setIsNumPadVisible(false);
    onRegisterManualIncome({ amount, note });
    Alert.alert(
      '¡Ingreso Registrado! 💰',
      `Sumaste Bs ${amount.toFixed(2)} a tus finanzas.\n¡Ganaste +${xpReward} XP para tu mascota!`
    );
  };

  const handleToggleSwitch = (val) => {
    setIsEnabled(val);
    onUpdateRecurringIncome({
      enabled: val,
    });
  };

  const handleSaveRecurringEdit = () => {
    const num = parseFloat(editAmount);
    if (isNaN(num) || num <= 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido mayor a 0');
      return;
    }

    onUpdateRecurringIncome({
      amount: num,
      period: editPeriod,
      enabled: isEnabled,
    });

    setIsEditModalVisible(false);
    Alert.alert('Configuración Guardada', 'Tu ingreso recurrente se ha actualizado con éxito.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💰 Gestión de Ingresos</Text>
        <Text style={styles.headerSubtitle}>
          Registra tus cobros y programa tus ingresos recurrentes
        </Text>
      </View>

      {/* TARJETA 1: REGISTRO MANUAL PRECARGADO */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardBadge}>Manual</Text>
          <Text style={styles.cardTitle}>Registrar Ingreso Manual</Text>
        </View>
        <Text style={styles.cardDesc}>
          Registra tu sueldo, honorarios o ingresos extra. Viene precargado con tu monto habitual de Bs {recurring.amount}.
        </Text>

        <View style={styles.preloadedBox}>
          <Text style={styles.preloadedLabel}>Monto habitual configurado:</Text>
          <Text style={styles.preloadedValue}>Bs {recurring.amount?.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.manualBtn}
          onPress={() => setIsNumPadVisible(true)}
        >
          <Text style={styles.manualBtnText}>
            + Registrar Ingreso (Bs {recurring.amount})
          </Text>
        </TouchableOpacity>

        <Text style={styles.xpBonusHint}>
          ✨ Te otorga <Text style={{ fontWeight: '800' }}>+{xpReward} XP</Text> (10 base + {streakBonus} bono de racha)
        </Text>
      </View>

      {/* TARJETA 2: INGRESO RECURRENTE AUTOMÁTICO */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardBadge, styles.cardBadgeGreen]}>Automático</Text>
          <Text style={styles.cardTitle}>Ingreso Recurrente Programado</Text>
        </View>

        <Text style={styles.cardDesc}>
          La app suma automáticamente este ingreso cada periodo al abrirse, incluso si estuvo cerrada varios días.
        </Text>

        {/* Fila del Switch Activar/Desactivar */}
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Ingreso automático activo</Text>
          <Switch
            value={isEnabled}
            onValueChange={handleToggleSwitch}
            trackColor={{ false: '#D1D5DB', true: '#A7F3D0' }}
            thumbColor={isEnabled ? '#348C60' : '#F3F4F6'}
          />
        </View>

        {/* Detalles de la configuración */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Monto habitual</Text>
            <Text style={styles.detailValue}>Bs {recurring.amount?.toFixed(2)}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Periodicidad</Text>
            <Text style={styles.detailValue}>{currentPeriodObj.name}</Text>
          </View>

          <View style={[styles.detailItem, { width: '100%' }]}>
            <Text style={styles.detailLabel}>Próximo ingreso automático</Text>
            <Text style={[styles.detailValue, { color: '#348C60' }]}>
              📅 {recurring.next_date || 'Calculando...'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => {
            setEditAmount(String(recurring.amount));
            setEditPeriod(recurring.period);
            setIsEditModalVisible(true);
          }}
        >
          <Text style={styles.editBtnText}>✏️ Editar Monto o Periodicidad</Text>
        </TouchableOpacity>
      </View>

      {/* TARJETA 3: EXPLICACIÓN DE FUNCIONAMIENTO OFFLINE */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>💡 ¿Cómo funciona el automático?</Text>
        <Text style={styles.infoText}>
          MetaFin funciona 100% offline. Cada vez que abras la app, calcula si pasaron los días de tu periodo y registra los ingresos que correspondan, avisándote con un globo de diálogo de tu mascota.
        </Text>
      </View>

      {/* Modal Teclado Numérico para Registro Manual */}
      <NumPadModal
        visible={isNumPadVisible}
        isIncome={true}
        initialAmount={String(recurring.amount || '')}
        onClose={() => setIsNumPadVisible(false)}
        onSubmit={handleManualIncomeSubmit}
      />

      {/* Modal de Edición de Configuración Recurrente */}
      <Modal visible={isEditModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.editCard}>
            <Text style={styles.editTitle}>Editar Ingreso Recurrente</Text>

            <Text style={styles.fieldLabel}>Monto Habitual ({GAME_CONFIG.CURRENCY})</Text>
            <TextInput
              style={styles.editInput}
              keyboardType="numeric"
              value={editAmount}
              onChangeText={setEditAmount}
            />

            <Text style={styles.fieldLabel}>Periodicidad:</Text>
            {INCOME_PERIODS.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[styles.periodOption, editPeriod === p.id && styles.periodOptionActive]}
                onPress={() => setEditPeriod(p.id)}
              >
                <Text style={[styles.periodText, editPeriod === p.id && styles.periodTextActive]}>
                  {editPeriod === p.id ? '● ' : '○ '}
                  {p.name}
                </Text>
              </TouchableOpacity>
            ))}

            <View style={styles.modalBtnsRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveRecurringEdit}
              >
                <Text style={styles.saveBtnText}>Guardar Cambios</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 16,
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#ECEAE4',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardBadge: {
    backgroundColor: '#FFF4E8',
    color: '#D97706',
    fontSize: 10,
    fontWeight: '800',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 8,
    textTransform: 'uppercase',
  },
  cardBadgeGreen: {
    backgroundColor: '#EAF6F0',
    color: '#2E7D5B',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#222',
  },
  cardDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginBottom: 12,
  },
  preloadedBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7F6F2',
    padding: 12,
    borderRadius: 14,
    marginBottom: 14,
  },
  preloadedLabel: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
  },
  preloadedValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2E7D5B',
  },
  manualBtn: {
    backgroundColor: '#348C60',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#348C60',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  manualBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  xpBonusHint: {
    fontSize: 11,
    color: '#7A8C84',
    textAlign: 'center',
    marginTop: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F2EFE9',
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  detailItem: {
    width: '48%',
    backgroundColor: '#FAF9F6',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFECE6',
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#222',
  },
  editBtn: {
    backgroundColor: '#F3EFEA',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A2518',
  },
  infoCard: {
    backgroundColor: '#EAF6F0',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#C8E8D8',
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#256E4A',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#3B7057',
    lineHeight: 17,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  editCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
  },
  editTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2E7D5B',
    marginBottom: 16,
    textAlign: 'center',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555',
    marginBottom: 6,
  },
  editInput: {
    backgroundColor: '#F8F7F4',
    borderWidth: 1.5,
    borderColor: '#D4E8DC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: '800',
    color: '#222',
    marginBottom: 14,
  },
  periodOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2DDD4',
    backgroundColor: '#FAF9F6',
    marginBottom: 8,
  },
  periodOptionActive: {
    borderColor: '#348C60',
    backgroundColor: '#EAF6F0',
  },
  periodText: {
    fontSize: 13,
    color: '#555',
  },
  periodTextActive: {
    color: '#256E4A',
    fontWeight: '800',
  },
  modalBtnsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F3EFEA',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 12,
    backgroundColor: '#348C60',
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
