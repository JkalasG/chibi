import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
} from 'react-native';
import HeaderStatus from '../components/UI/HeaderStatus';
import PetMascot from '../components/Mascot/PetMascot';
import CategoryButton from '../components/UI/CategoryButton';
import NumPadModal from '../components/UI/NumPadModal';
import DialogBubble from '../components/UI/DialogBubble';
import FloatingXP from '../components/UI/FloatingXP';
import { EXPENSE_CATEGORIES, GAME_CONFIG } from '../config/gameConfig';

export default function DashboardScreen({
  data,
  onRegisterExpense,
  autoIncomeNotification = null,
  highlightCategories = false,
  onNavigateToHistory,
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isNumPadVisible, setIsNumPadVisible] = useState(false);
  const [currentAnim, setCurrentAnim] = useState('sonreir');
  const [floatingXp, setFloatingXp] = useState(null);
  const [levelUpModal, setLevelUpModal] = useState(null);

  const user = data?.user || {};
  const pet = data?.pet || { level: 2, current_xp: 0, stage: 'Bebé', mood: 'HAPPY', name: 'Inu' };
  const streak = data?.streak || { current_days: 0 };
  const alias = user?.alias || 'Amigo';

  // Mensaje dinámico del globo de diálogo
  const getBubbleMessage = () => {
    if (autoIncomeNotification) {
      return `¡${alias}, llegó tu ingreso de Bs ${autoIncomeNotification.amount.toFixed(2)}! 💰`;
    }
    if (pet.mood === 'SAD') {
      return `¡Tengo hambre ${alias}! 😢 Registra un gasto hoy para que vuelva a sonreír.`;
    }
    if (streak.current_days >= GAME_CONFIG.GOLDEN_STREAK_DAYS) {
      return `¡Increíble racha dorada de ${streak.current_days} días! 🔥 Ganas +${streak.current_days - 1} XP extra.`;
    }
    if (streak.current_days > 1) {
      return `¡Llevamos ${streak.current_days} días seguidos! 🐾 ¡Sigue así para crecer más rápido!`;
    }
    return `¡Hola ${alias}! Toca una categoría para alimentarme y registrar un gasto. ✨`;
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    setIsNumPadVisible(true);
  };

  const handleNumPadSubmit = ({ amount, categoryId, note }) => {
    setIsNumPadVisible(false);

    // Animación de la mascota: si es comida -> 'comer', sino 'superAlegre'
    const animToPlay = categoryId === 'FOOD' ? 'comer' : 'superAlegre';
    setCurrentAnim(animToPlay);

    const result = onRegisterExpense({ amount, categoryId, note });

    // Mostrar texto flotante de XP ganado
    setFloatingXp(result.xpAwarded);

    // Revisar si subió de nivel
    if (result.leveledUp) {
      setTimeout(() => {
        setLevelUpModal({
          level: result.newLevel,
          stage: result.newStage,
        });
      }, 700);
    }

    // Regresar a sonreir después de 2.5s
    setTimeout(() => {
      setCurrentAnim('sonreir');
    }, 2600);
  };

  const handlePetTap = () => {
    const tapAnims = ['saludar', 'moverCola', 'superAlegre'];
    const randomAnim = tapAnims[Math.floor(Math.random() * tapAnims.length)];
    setCurrentAnim(randomAnim);
    setTimeout(() => {
      setCurrentAnim('sonreir');
    }, 2000);
  };

  const recentExpenses = (data?.transactions || []).filter((t) => t.type === 'EXPENSE').slice(0, 3);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Barra de Estado (Racha, XP, Nivel) */}
      <HeaderStatus
        streakDays={streak.current_days || 0}
        currentXp={pet.current_xp || 0}
        level={pet.level || 2}
        stage={pet.stage || 'Bebé'}
      />

      {/* Escenario de la Mascota */}
      <View style={styles.stageCard}>
        {floatingXp && (
          <FloatingXP xp={floatingXp} onComplete={() => setFloatingXp(null)} />
        )}

        <View style={styles.bubbleArea}>
          <DialogBubble
            text={getBubbleMessage()}
            highlight={Boolean(autoIncomeNotification || pet.mood === 'SAD')}
          />
        </View>

        <PetMascot
          isHatched={true}
          currentAnim={currentAnim}
          mood={pet.mood || 'HAPPY'}
          stage={pet.stage || 'Bebé'}
          size={250}
          onTap={handlePetTap}
        />
        <Text style={styles.tapTipText}>Toca a {pet.name} para saludar 🐾</Text>
      </View>

      {/* Sección de Registro Rápido en 2 Toques */}
      <View style={styles.quickRegisterSection}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>⚡ Registro Rápido (2 Toques)</Text>
          <Text style={styles.sectionHint}>Alimenta a tu mascota</Text>
        </View>

        <View style={styles.categoryGrid}>
          {EXPENSE_CATEGORIES.map((cat) => (
            <CategoryButton
              key={cat.id}
              category={cat}
              onPress={handleCategoryPress}
              highlighted={highlightCategories && cat.id === 'FOOD'}
            />
          ))}
        </View>
      </View>

      {/* Vista previa de transacciones recientes */}
      {recentExpenses.length > 0 && (
        <View style={styles.recentCard}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>📋 Gastos de Hoy</Text>
            <TouchableOpacity onPress={onNavigateToHistory}>
              <Text style={styles.viewAllText}>Ver todo →</Text>
            </TouchableOpacity>
          </View>
          {recentExpenses.map((item) => {
            const cat = EXPENSE_CATEGORIES.find((c) => c.id === item.category_id) || EXPENSE_CATEGORIES[0];
            return (
              <View key={item.id} style={styles.recentItem}>
                <View style={styles.recentItemLeft}>
                  <Text style={styles.recentIcon}>{cat.icon}</Text>
                  <View>
                    <Text style={styles.recentCatName}>{cat.name}</Text>
                    <Text style={styles.recentNote}>{item.note || 'Sin nota'}</Text>
                  </View>
                </View>
                <Text style={styles.recentAmount}>
                  -Bs {item.amount.toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Modal de Teclado Numérico */}
      <NumPadModal
        visible={isNumPadVisible}
        category={selectedCategory}
        onClose={() => setIsNumPadVisible(false)}
        onSubmit={handleNumPadSubmit}
      />

      {/* Modal de Celebración de Subida de Nivel */}
      <Modal visible={Boolean(levelUpModal)} transparent animationType="fade">
        <View style={styles.levelUpOverlay}>
          <View style={styles.levelUpCard}>
            <Text style={styles.levelUpEmoji}>🎉🌟</Text>
            <Text style={styles.levelUpTitle}>¡SUBISTE DE NIVEL!</Text>
            <Text style={styles.levelUpSubtitle}>
              {pet.name} ahora es <Text style={styles.levelUpStage}>Nivel {levelUpModal?.level} ({levelUpModal?.stage})</Text>
            </Text>
            <Text style={styles.levelUpDesc}>
              ¡Tu constancia financiera está dando frutos! Tu compañero se fortalece y crece contigo.
            </Text>
            <TouchableOpacity style={styles.levelUpBtn} onPress={() => setLevelUpModal(null)}>
              <Text style={styles.levelUpBtnText}>¡Genial! 🚀</Text>
            </TouchableOpacity>
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
  stageCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingTop: 12,
    paddingBottom: 10,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#ECEAE4',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  bubbleArea: {
    width: '100%',
    marginBottom: 4,
  },
  tapTipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    marginTop: 2,
  },
  quickRegisterSection: {
    width: '100%',
    marginBottom: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4A2518',
  },
  sectionHint: {
    fontSize: 11,
    fontWeight: '700',
    color: '#348C60',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  recentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#ECEAE4',
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recentTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4A2518',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#348C60',
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F3EF',
  },
  recentItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  recentCatName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
  recentNote: {
    fontSize: 11,
    color: '#888',
  },
  recentAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#E53935',
  },
  levelUpOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  levelUpCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  levelUpEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  levelUpTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#F69B42',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  levelUpSubtitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2E7D5B',
    marginBottom: 10,
    textAlign: 'center',
  },
  levelUpStage: {
    fontWeight: '900',
  },
  levelUpDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  levelUpBtn: {
    backgroundColor: '#348C60',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 14,
  },
  levelUpBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
