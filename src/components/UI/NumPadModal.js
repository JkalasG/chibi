import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { GAME_CONFIG } from '../../config/gameConfig';

export default function NumPadModal({
  visible,
  category,
  onClose,
  onSubmit,
  isIncome = false,
  initialAmount = '',
}) {
  const [val, setVal] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (visible) {
      setVal(initialAmount ? String(initialAmount) : '');
      setNote('');
    }
  }, [visible, initialAmount]);

  const handleKeyPress = (char) => {
    if (char === '.') {
      if (val.includes('.')) return;
      if (val === '') {
        setVal('0.');
        return;
      }
    }

    // Limitar a máximo 2 decimales
    if (val.includes('.')) {
      const parts = val.split('.');
      if (parts[1] && parts[1].length >= 2) return;
    }

    // Limitar longitud
    if (val.length >= 8) return;

    // Evitar ceros múltiples al inicio
    if (val === '0' && char !== '.') {
      setVal(char);
      return;
    }

    setVal((prev) => prev + char);
  };

  const handleDelete = () => {
    setVal((prev) => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) return;
    onSubmit({
      amount: num,
      categoryId: category ? category.id : null,
      note: note.trim(),
    });
    setVal('');
    setNote('');
  };

  const parsedNum = parseFloat(val);
  const isValid = !isNaN(parsedNum) && parsedNum > 0;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              {/* Encabezado con categoría */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  {category ? (
                    <View style={[styles.catIconWrap, { backgroundColor: category.color + '25' }]}>
                      <Text style={styles.catIcon}>{category.icon}</Text>
                    </View>
                  ) : (
                    <View style={[styles.catIconWrap, { backgroundColor: '#348C6025' }]}>
                      <Text style={styles.catIcon}>💰</Text>
                    </View>
                  )}
                  <View>
                    <Text style={styles.catTitle}>
                      {isIncome ? 'Registrar Ingreso' : category?.name || 'Gasto'}
                    </Text>
                    <Text style={styles.catSubtitle}>
                      {isIncome ? 'Suma dinero y alimenta a tu Inu' : '2 toques para alimentar a tu mascota'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Display del monto */}
              <View style={styles.displayArea}>
                <Text style={styles.currencySymbol}>{GAME_CONFIG.CURRENCY}</Text>
                <Text style={styles.displayText}>
                  {val.length > 0 ? val : '0.00'}
                </Text>
              </View>

              {/* Nota opcional breve */}
              <TextInput
                style={styles.noteInput}
                placeholder="Nota opcional (ej. Almuerzo, Farmacia...)"
                placeholderTextColor="#A0AAB0"
                value={note}
                onChangeText={setNote}
                maxLength={40}
              />

              {/* Teclado Numérico Personalizado */}
              <View style={styles.keypad}>
                <View style={styles.keyRow}>
                  {['1', '2', '3'].map((k) => (
                    <TouchableOpacity key={k} style={styles.keyBtn} onPress={() => handleKeyPress(k)}>
                      <Text style={styles.keyText}>{k}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.keyRow}>
                  {['4', '5', '6'].map((k) => (
                    <TouchableOpacity key={k} style={styles.keyBtn} onPress={() => handleKeyPress(k)}>
                      <Text style={styles.keyText}>{k}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.keyRow}>
                  {['7', '8', '9'].map((k) => (
                    <TouchableOpacity key={k} style={styles.keyBtn} onPress={() => handleKeyPress(k)}>
                      <Text style={styles.keyText}>{k}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.keyRow}>
                  <TouchableOpacity style={styles.keyBtn} onPress={() => handleKeyPress('.')}>
                    <Text style={styles.keyText}>.</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.keyBtn} onPress={() => handleKeyPress('0')}>
                    <Text style={styles.keyText}>0</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyBtn, styles.deleteKeyBtn]} onPress={handleDelete}>
                    <Text style={styles.deleteKeyText}>⌫</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Botón de Confirmación */}
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  isValid
                    ? isIncome
                      ? styles.submitBtnIncome
                      : styles.submitBtnActive
                    : styles.submitBtnDisabled,
                ]}
                disabled={!isValid}
                onPress={handleConfirm}
              >
                <Text style={styles.submitBtnText}>
                  {isValid
                    ? isIncome
                      ? `Registrar Ingreso (Bs ${val})`
                      : `Registrar Gasto (Bs ${val})`
                    : 'Ingresa un monto'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  catIcon: {
    fontSize: 22,
  },
  catTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#222',
  },
  catSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3EFEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#666',
  },
  displayArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7FAF8',
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#D4E8DC',
    marginBottom: 10,
  },
  currencySymbol: {
    fontSize: 22,
    fontWeight: '800',
    color: '#348C60',
    marginRight: 6,
  },
  displayText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#1B4D35',
    letterSpacing: 1,
  },
  noteInput: {
    backgroundColor: '#F9F8F6',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#333',
    marginBottom: 12,
  },
  keypad: {
    marginBottom: 14,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  keyBtn: {
    flex: 1,
    height: 48,
    backgroundColor: '#F7F6F2',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E9E5DC',
  },
  keyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
  },
  deleteKeyBtn: {
    backgroundColor: '#FEECEC',
    borderColor: '#FCD4D4',
  },
  deleteKeyText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#D9383A',
  },
  submitBtn: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnActive: {
    backgroundColor: '#F69B42',
    shadowColor: '#F69B42',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  submitBtnIncome: {
    backgroundColor: '#348C60',
    shadowColor: '#348C60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  submitBtnDisabled: {
    backgroundColor: '#E2E0D8',
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
