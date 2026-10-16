import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { GAME_CONFIG } from '../config/gameConfig';

export default function HelpScreen({
  onRepeatTutorial,
  onDevAddXP,
  onDevToggleMood,
  onDevAdvanceDay,
  onDevResetApp,
}) {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const FAQS = [
    {
      id: 'level',
      q: '¿Cómo subir de nivel a tu mascota?',
      a: 'Cada vez que registras un gasto o un ingreso manual ganas puntos de experiencia (XP). Al acumular 100 XP, tu perrito sube de nivel y evoluciona en sus distintas etapas: Bebé (niveles 2-5), Juvenil (niveles 6-10) y Leyenda (nivel 11+).',
    },
    {
      id: 'streak',
      q: '¿Cómo funcionan las rachas y el bono de XP?',
      a: 'Si registras al menos 1 gasto cada día calendario, tu racha aumenta. Cada día de racha suma +1 XP adicional a todos tus registros manuales (Día 1: 10 XP, Día 2: 11 XP, Día 3: 12 XP... ¡y racha dorada a partir de los 7 días!). Si te saltas un día sin registrar gastos, la racha vuelve a 0.',
    },
    {
      id: 'mood',
      q: '¿Cómo mantener feliz a tu compañero?',
      a: 'Tu perrito se alimenta de tus hábitos financieros. Si registras tus gastos en un lapso menor a 24 horas, estará alegre y juguetón. Si pasan más de 24 horas sin registrar gastos, se sentirá triste. ¡No te preocupes, nunca muere ni pierde niveles, solo debes registrar un nuevo gasto para alegrarlo!',
    },
    {
      id: 'auto_income',
      q: '¿Cómo funciona el ingreso recurrente automático?',
      a: 'Configuras tu monto y periodicidad (semanal, quincenal o mensual). Como MetaFin funciona 100% offline en tu teléfono, cada vez que abres la aplicación se calculan los días transcurridos y se registran automáticamente los sueldos pendientes.',
    },
  ];

  const toggleFaq = (id) => {
    setExpandedFaq((prev) => (prev === id ? null : id));
  };

  const confirmReset = () => {
    Alert.alert(
      'Reiniciar Demo',
      '¿Estás seguro de que deseas reiniciar todos los datos y volver a la pantalla de registro y eclosión del huevo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, reiniciar',
          style: 'destructive',
          onPress: onDevResetApp,
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>❓ Ayuda y Guía de Uso</Text>
        <Text style={styles.headerSubtitle}>
          Aprende a sacarle el máximo provecho a MetaFin
        </Text>
      </View>

      {/* SECCIÓN 1: TUTORIAL INTERACTIVO */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🐾 Tutorial de la Mascota</Text>
        <Text style={styles.cardDesc}>
          ¿Quieres recordar los consejos iniciales de tu compañero perrito?
        </Text>
        <TouchableOpacity style={styles.tutorialBtn} onPress={onRepeatTutorial}>
          <Text style={styles.tutorialBtnText}>▶️ Repetir Tutorial Interactivo</Text>
        </TouchableOpacity>
      </View>

      {/* SECCIÓN 2: ACORDEÓN DE PREGUNTAS FRECUENTES */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📖 Preguntas Frecuentes</Text>

        {FAQS.map((faq) => {
          const isExpanded = expandedFaq === faq.id;
          return (
            <View key={faq.id} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqQuestionBtn}
                onPress={() => toggleFaq(faq.id)}
              >
                <Text style={styles.faqQuestionText}>{faq.q}</Text>
                <Text style={styles.faqArrow}>{isExpanded ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {isExpanded && (
                <View style={styles.faqAnswerBox}>
                  <Text style={styles.faqAnswerText}>{faq.a}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* SECCIÓN 3: PANEL DE CONTROL DE PRUEBAS / DEMO (F-49) */}
      <View style={[styles.card, styles.devCard]}>
        <View style={styles.devHeader}>
          <Text style={styles.devTag}>Herramienta Demo</Text>
          <Text style={styles.devTitle}>🛠️ Menú de Depuración (Dev Tools)</Text>
        </View>
        <Text style={styles.devDesc}>
          Usa estos controles para demostrar todas las mecánicas en vivo sin esperar días reales.
        </Text>

        <View style={styles.devGrid}>
          <TouchableOpacity style={styles.devBtn} onPress={onDevAddXP}>
            <Text style={styles.devBtnIcon}>⚡</Text>
            <Text style={styles.devBtnText}>+25 XP</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.devBtn} onPress={onDevAdvanceDay}>
            <Text style={styles.devBtnIcon}>📅</Text>
            <Text style={styles.devBtnText}>Avanzar 1 Día</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.devBtn} onPress={onDevToggleMood}>
            <Text style={styles.devBtnIcon}>🎭</Text>
            <Text style={styles.devBtnText}>Alternar Ánimo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.devBtn, styles.devResetBtn]} onPress={confirmReset}>
            <Text style={styles.devBtnIcon}>🥚</Text>
            <Text style={[styles.devBtnText, styles.devResetBtnText]}>Reiniciar Demo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.footerNote}>
        MetaFin v1.0 • Hecho con dedicación para Bolivia 🇧🇴
      </Text>
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
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4A2518',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    lineHeight: 17,
  },
  tutorialBtn: {
    backgroundColor: '#EAF6F0',
    borderWidth: 1.5,
    borderColor: '#348C60',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  tutorialBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#256E4A',
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2EFE9',
    paddingVertical: 10,
  },
  faqQuestionBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    paddingRight: 10,
  },
  faqArrow: {
    fontSize: 11,
    color: '#348C60',
    fontWeight: '800',
  },
  faqAnswerBox: {
    backgroundColor: '#FAF9F6',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  faqAnswerText: {
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
  },
  devCard: {
    borderColor: '#F69B42',
    backgroundColor: '#FFFDF9',
  },
  devHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  devTag: {
    backgroundColor: '#FFF4E8',
    color: '#D97706',
    fontSize: 9,
    fontWeight: '900',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginRight: 6,
    textTransform: 'uppercase',
  },
  devTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#C05621',
  },
  devDesc: {
    fontSize: 11,
    color: '#7B6F64',
    marginBottom: 12,
  },
  devGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  devBtn: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E3DA',
    paddingVertical: 10,
    borderRadius: 12,
  },
  devBtnIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  devBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#444',
  },
  devResetBtn: {
    borderColor: '#FECACA',
    backgroundColor: '#FFF5F5',
  },
  devResetBtnText: {
    color: '#DC2626',
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 11,
    color: '#A0AAB0',
    marginTop: 8,
  },
});
