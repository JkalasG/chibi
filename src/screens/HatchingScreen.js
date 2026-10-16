import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import PetMascot from '../components/Mascot/PetMascot';
import DialogBubble from '../components/UI/DialogBubble';
import { EXPENSE_CATEGORIES, INCOME_PERIODS, GAME_CONFIG } from '../config/gameConfig';

export default function HatchingScreen({
  user,
  pet,
  initialStep = 'HATCH_INCOME', // 'HATCH_INCOME' | 'HATCH_EXPENSE' | 'TUTORIAL'
  onCompleteHatching,
}) {
  const [step, setStep] = useState(initialStep);

  // Paso 1: Ingreso inicial y recurrente
  const [incomeAmount, setIncomeAmount] = useState('2500');
  const [selectedPeriod, setSelectedPeriod] = useState('MONTHLY');

  // Paso 2: Primer gasto
  const [expenseAmount, setExpenseAmount] = useState('25');
  const [selectedCategory, setSelectedCategory] = useState(EXPENSE_CATEGORIES[0]); // Alimentación

  // Paso 3: Tutorial (índice de 0 a 3)
  const [tutorialIndex, setTutorialIndex] = useState(0);

  // Estado visual del huevo / mascota
  const [eggPhase, setEggPhase] = useState(step === 'HATCH_EXPENSE' ? 1 : 0);
  const [isHatched, setIsHatched] = useState(step === 'TUTORIAL');
  const [mascotAnim, setMascotAnim] = useState('sonreir');
  const [mascotMood, setMascotMood] = useState('HAPPY');

  // Mensajes del tutorial
  const alias = user?.alias || 'Amigo';
  const petName = pet?.name || 'Inu';

  const TUTORIAL_MESSAGES = [
    `¡Hola ${alias}! Soy ${petName}. 🐾 ¡Gracias por ayudarme a nacer!`,
    `Para mantenerme feliz y alimentado, registra tus gastos todos los días. 🍎`,
    `Cada vez que registras algo ganas experiencia y yo crezco. ¡Si registras varios días seguidos ganas más racha! 🔥`,
    `Toca los botones de abajo para registrar un gasto en solo 2 toques. ¡Vamos juntos! ✨`,
  ];

  // Acción Paso 1: Guardar ingreso inicial y agrietar huevo
  const handleRegisterIncome = () => {
    const num = parseFloat(incomeAmount);
    if (isNaN(num) || num <= 0) return;

    setEggPhase(2);
    setStep('HATCH_EXPENSE');
  };

  // Acción Paso 2: Guardar primer gasto y romper huevo
  const handleRegisterExpense = () => {
    const num = parseFloat(expenseAmount);
    if (isNaN(num) || num <= 0) return;

    setEggPhase(3);
    setTimeout(() => {
      setIsHatched(true);
      setMascotAnim('saludar');
      setStep('TUTORIAL');
    }, 450);
  };

  // Acción Paso 3: Avanzar tutorial
  const handleNextTutorial = () => {
    if (tutorialIndex < TUTORIAL_MESSAGES.length - 1) {
      setTutorialIndex((prev) => prev + 1);
      if (tutorialIndex === 1) setMascotAnim('superAlegre');
      else if (tutorialIndex === 2) setMascotAnim('moverCola');
    } else {
      // Completar tutorial y pasar al Dashboard
      onCompleteHatching({
        initialIncome: parseFloat(incomeAmount),
        incomePeriod: selectedPeriod,
        firstExpense: {
          amount: parseFloat(expenseAmount),
          category: selectedCategory.id,
        },
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.stepTag}>
          {step === 'HATCH_INCOME' && 'Paso 1: Ingreso Base'}
          {step === 'HATCH_EXPENSE' && 'Paso 2: Primer Gasto'}
          {step === 'TUTORIAL' && 'Paso 3: ¡Tu Compañero Ha Nacido!'}
        </Text>
        <Text style={styles.title}>
          {step === 'TUTORIAL' ? `¡Bienvenido ${petName}! 🎉` : 'Nacimiento de tu Mascota'}
        </Text>
      </View>

      {/* Escenario de la Mascota / Huevo */}
      <View style={styles.stageBox}>
        <PetMascot
          isHatched={isHatched}
          eggPhase={eggPhase}
          currentAnim={mascotAnim}
          mood={mascotMood}
          size={240}
          onTap={() => {
            if (isHatched) setMascotAnim('moverCola');
          }}
        />

        {step === 'TUTORIAL' && (
          <View style={styles.bubbleWrap}>
            <DialogBubble
              text={TUTORIAL_MESSAGES[tutorialIndex]}
              showTapHint={true}
              onPress={handleNextTutorial}
              highlight={true}
            />
          </View>
        )}
      </View>

      {/* CONTENIDO SEGÚN PASO */}
      {step === 'HATCH_INCOME' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💰 Ingreso Inicial y Recurrente</Text>
          <Text style={styles.cardDesc}>
            Indica tu ingreso regular (sueldo o pensión). Servirá para sumar tus ingresos automáticamente en cada periodo.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Monto Estimado ({GAME_CONFIG.CURRENCY})</Text>
            <View style={styles.amountInputRow}>
              <Text style={styles.currencyPrefix}>{GAME_CONFIG.CURRENCY}</Text>
              <TextInput
                style={styles.amountInput}
                keyboardType="numeric"
                value={incomeAmount}
                onChangeText={setIncomeAmount}
                placeholder="2500"
              />
            </View>
          </View>

          <Text style={styles.label}>Periodicidad del Ingreso:</Text>
          <View style={styles.periodsCol}>
            {INCOME_PERIODS.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[styles.periodOption, selectedPeriod === p.id && styles.periodOptionActive]}
                onPress={() => setSelectedPeriod(p.id)}
              >
                <Text style={[styles.periodOptionText, selectedPeriod === p.id && styles.periodOptionTextActive]}>
                  {selectedPeriod === p.id ? '● ' : '○ '}
                  {p.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.actionBtn} onPress={handleRegisterIncome}>
            <Text style={styles.actionBtnText}>Registrar Ingreso y Agrietar Huevo 🔨</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 'HATCH_EXPENSE' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🍎 Registra tu Primer Gasto</Text>
          <Text style={styles.cardDesc}>
            ¡El cascarón empezó a agrietarse! Registra tu primer gasto de hoy para romperlo y hacer nacer a tu cachorro.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Monto del Gasto ({GAME_CONFIG.CURRENCY})</Text>
            <View style={styles.amountInputRow}>
              <Text style={styles.currencyPrefix}>{GAME_CONFIG.CURRENCY}</Text>
              <TextInput
                style={styles.amountInput}
                keyboardType="numeric"
                value={expenseAmount}
                onChangeText={setExpenseAmount}
                placeholder="25"
              />
            </View>
          </View>

          <Text style={styles.label}>Categoría:</Text>
          <View style={styles.categoryGrid}>
            {EXPENSE_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.catMiniBtn,
                  selectedCategory.id === cat.id && styles.catMiniBtnActive,
                  { borderColor: cat.color },
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={styles.catMiniIcon}>{cat.icon}</Text>
                <Text style={[styles.catMiniText, selectedCategory.id === cat.id && { color: cat.color }]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnOrange]} onPress={handleRegisterExpense}>
            <Text style={styles.actionBtnText}>¡Romper Cascarón y Eclosionar! 🐣✨</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 'TUTORIAL' && (
        <View style={styles.tutorialFooter}>
          <Text style={styles.tutorialStepInfo}>
            Mensaje {tutorialIndex + 1} de {TUTORIAL_MESSAGES.length}
          </Text>
          <TouchableOpacity style={styles.actionBtn} onPress={handleNextTutorial}>
            <Text style={styles.actionBtnText}>
              {tutorialIndex < TUTORIAL_MESSAGES.length - 1 ? 'Siguiente Mensaje 👉' : '¡Comenzar mi Aventura Financiera! 🚀'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FDFBF7',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  stepTag: {
    fontSize: 12,
    fontWeight: '800',
    color: '#348C60',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#2E7D5B',
    textAlign: 'center',
  },
  stageBox: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5EFEA',
  },
  bubbleWrap: {
    width: '100%',
    marginTop: 8,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#ECEAE4',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4A2518',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 12,
    color: '#777',
    lineHeight: 18,
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555',
    marginBottom: 6,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F8F5',
    borderWidth: 1.5,
    borderColor: '#D4E8DC',
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '800',
    color: '#348C60',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    height: 48,
    fontSize: 22,
    fontWeight: '800',
    color: '#222',
  },
  periodsCol: {
    marginBottom: 16,
  },
  periodOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E4DFD5',
    backgroundColor: '#FAF9F6',
    marginBottom: 8,
  },
  periodOptionActive: {
    borderColor: '#348C60',
    backgroundColor: '#EAF6F0',
  },
  periodOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  periodOptionTextActive: {
    color: '#256E4A',
    fontWeight: '800',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  catMiniBtn: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
  },
  catMiniBtnActive: {
    backgroundColor: '#FFF4E8',
  },
  catMiniIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  catMiniText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#444',
  },
  actionBtn: {
    backgroundColor: '#348C60',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#348C60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  actionBtnOrange: {
    backgroundColor: '#F69B42',
    shadowColor: '#F69B42',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  tutorialFooter: {
    width: '100%',
    alignItems: 'center',
  },
  tutorialStepInfo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A9992',
    marginBottom: 10,
  },
});
