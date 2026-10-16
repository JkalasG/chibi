import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { BOLIVIA_CITIES, GAME_CONFIG } from '../config/gameConfig';
import PetMascot from '../components/Mascot/PetMascot';

export default function OnboardingScreen({ onComplete }) {
  // Datos personales
  const [fullName, setFullName] = useState('');
  const [alias, setAlias] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(BOLIVIA_CITIES[0]); // 'La Paz' por defecto
  const [showCityPicker, setShowCityPicker] = useState(false);

  // Datos de la mascota
  const [petName, setPetName] = useState('Inu');
  const [selectedEggIndex, setSelectedEggIndex] = useState(0);

  // Validaciones
  const isFullNameValid = fullName.trim().length >= 3;
  const isAliasValid = alias.trim().length >= 2 && alias.trim().length <= 15;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPhoneValid = /^\d{7,10}$/.test(phone.trim());
  const isPetNameValid = petName.trim().length >= 2 && petName.trim().length <= 12;

  const isFormValid =
    isFullNameValid && isAliasValid && isEmailValid && isPhoneValid && isPetNameValid;

  const handleEggSelect = (index) => {
    if (index !== 0) {
      Alert.alert('Próximamente', 'Este huevo místico estará disponible en futuras actualizaciones de MetaFin.');
      return;
    }
    setSelectedEggIndex(0);
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    const userData = {
      full_name: fullName.trim(),
      alias: alias.trim(),
      email: email.trim(),
      phone_country_code: GAME_CONFIG.DEFAULT_COUNTRY_CODE,
      phone_number: phone.trim(),
      city,
      currency: GAME_CONFIG.CURRENCY,
      onboarding_step: 'HATCH_INCOME',
    };

    const petData = {
      name: petName.trim(),
      species: 'DOG',
      level: 1,
      current_xp: 0,
      total_xp: 0,
      stage: 'Huevo',
      mood: 'HAPPY',
      hatched_at: null,
    };

    onComplete({ user: userData, pet: petData });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.stepTag}>Paso 1 de 2 • Configuración</Text>
        <Text style={styles.title}>Crea tu Perfil</Text>
        <Text style={styles.subtitle}>
          Conecta tus finanzas con tu compañero virtual en Bolivia
        </Text>
      </View>

      {/* SECCIÓN 1: DATOS PERSONALES */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>👤 Datos Personales</Text>

        {/* Nombre completo */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre Completo *</Text>
          <TextInput
            style={[styles.input, fullName.length > 0 && !isFullNameValid && styles.inputError]}
            placeholder="Ej. Carlos Mendoza"
            placeholderTextColor="#A0AAB0"
            value={fullName}
            onChangeText={setFullName}
          />
          {fullName.length > 0 && !isFullNameValid && (
            <Text style={styles.errorText}>Mínimo 3 caracteres</Text>
          )}
        </View>

        {/* Alias */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Alias (cómo te llamará tu mascota) *</Text>
          <TextInput
            style={[styles.input, alias.length > 0 && !isAliasValid && styles.inputError]}
            placeholder="Ej. Charlie"
            placeholderTextColor="#A0AAB0"
            value={alias}
            onChangeText={setAlias}
            maxLength={15}
          />
          {alias.length > 0 && !isAliasValid && (
            <Text style={styles.errorText}>Entre 2 y 15 caracteres</Text>
          )}
        </View>

        {/* Correo electrónico */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo Electrónico *</Text>
          <TextInput
            style={[styles.input, email.length > 0 && !isEmailValid && styles.inputError]}
            placeholder="carlos@ejemplo.com"
            placeholderTextColor="#A0AAB0"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          {email.length > 0 && !isEmailValid && (
            <Text style={styles.errorText}>Ingresa un email válido</Text>
          )}
        </View>

        {/* Teléfono */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Número Telefónico *</Text>
          <View style={styles.phoneRow}>
            <View style={styles.countryCodeBox}>
              <Text style={styles.countryCodeText}>🇧🇴 +591</Text>
            </View>
            <TextInput
              style={[
                styles.input,
                styles.phoneInput,
                phone.length > 0 && !isPhoneValid && styles.inputError,
              ]}
              placeholder="70012345"
              placeholderTextColor="#A0AAB0"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={10}
            />
          </View>
          {phone.length > 0 && !isPhoneValid && (
            <Text style={styles.errorText}>Número telefónico de 7 a 10 dígitos</Text>
          )}
        </View>

        {/* Ciudad */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ciudad / Ubicación *</Text>
          <TouchableOpacity
            style={styles.dropdownBtn}
            onPress={() => setShowCityPicker(true)}
          >
            <Text style={styles.dropdownText}>📍 {city}</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SECCIÓN 2: DATOS DE LA MASCOTA Y HUEVO */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🥚 Tu Mascota Virtual</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre de tu Mascota *</Text>
          <TextInput
            style={[styles.input, petName.length > 0 && !isPetNameValid && styles.inputError]}
            placeholder="Ej. Inu"
            placeholderTextColor="#A0AAB0"
            value={petName}
            onChangeText={setPetName}
            maxLength={12}
          />
          {petName.length > 0 && !isPetNameValid && (
            <Text style={styles.errorText}>Máximo 12 caracteres</Text>
          )}
        </View>

        <Text style={styles.label}>Selecciona tu Huevo:</Text>
        <View style={styles.eggsRow}>
          {/* Huevo 1: Perrito (Disponible) */}
          <TouchableOpacity
            style={[styles.eggCard, selectedEggIndex === 0 && styles.eggCardActive]}
            onPress={() => handleEggSelect(0)}
          >
            <View style={styles.eggPreview}>
              <PetMascot isHatched={false} eggPhase={0} size={110} />
            </View>
            <Text style={styles.eggName}>Perrito Inu 🐾</Text>
            <Text style={styles.eggStatus}>Disponible</Text>
          </TouchableOpacity>

          {/* Huevo 2: Bloqueado */}
          <TouchableOpacity
            style={[styles.eggCard, styles.eggCardLocked]}
            onPress={() => handleEggSelect(1)}
          >
            <View style={styles.eggLockedBox}>
              <Text style={styles.lockIcon}>🔒</Text>
              <Text style={styles.eggSilhouette}>🥚</Text>
            </View>
            <Text style={styles.eggNameLocked}>Gatito Místico</Text>
            <Text style={styles.eggStatusLocked}>Próximamente</Text>
          </TouchableOpacity>

          {/* Huevo 3: Bloqueado */}
          <TouchableOpacity
            style={[styles.eggCard, styles.eggCardLocked]}
            onPress={() => handleEggSelect(2)}
          >
            <View style={styles.eggLockedBox}>
              <Text style={styles.lockIcon}>🔒</Text>
              <Text style={styles.eggSilhouette}>🥚</Text>
            </View>
            <Text style={styles.eggNameLocked}>Dragón Guardián</Text>
            <Text style={styles.eggStatusLocked}>Próximamente</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botón Continuar */}
      <TouchableOpacity
        style={[styles.continueBtn, isFormValid ? styles.continueBtnActive : styles.continueBtnDisabled]}
        disabled={!isFormValid}
        onPress={handleSubmit}
      >
        <Text style={styles.continueBtnText}>
          {isFormValid ? 'Continuar a la Eclosión 🚀' : 'Completa todos los campos obligatorios'}
        </Text>
      </TouchableOpacity>

      {/* Modal de selección de ciudad */}
      <Modal visible={showCityPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.cityPickerCard}>
            <Text style={styles.cityPickerTitle}>Selecciona tu Ciudad</Text>
            <ScrollView style={{ maxHeight: 320 }}>
              {BOLIVIA_CITIES.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.cityItem, city === c && styles.cityItemActive]}
                  onPress={() => {
                    setCity(c);
                    setShowCityPicker(false);
                  }}
                >
                  <Text style={[styles.cityText, city === c && styles.cityTextActive]}>
                    {city === c ? '✓ ' : ''}{c}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.cityCancelBtn} onPress={() => setShowCityPicker(false)}>
              <Text style={styles.cityCancelText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FDFBF7',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
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
    fontSize: 28,
    fontWeight: '900',
    color: '#2E7D5B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#7A8C84',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#ECEAE4',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4A2518',
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F8F7F4',
    borderWidth: 1.5,
    borderColor: '#E2DCD3',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#222',
  },
  inputError: {
    borderColor: '#E53935',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    fontSize: 11,
    color: '#E53935',
    fontWeight: '600',
    marginTop: 4,
  },
  phoneRow: {
    flexDirection: 'row',
  },
  countryCodeBox: {
    backgroundColor: '#ECEAE4',
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  countryCodeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
  phoneInput: {
    flex: 1,
  },
  dropdownBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F7F4',
    borderWidth: 1.5,
    borderColor: '#E2DCD3',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D5B',
  },
  dropdownArrow: {
    fontSize: 11,
    color: '#888',
  },
  eggsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  eggCard: {
    flex: 1,
    backgroundColor: '#F7FBF9',
    borderWidth: 2,
    borderColor: '#D4E8DC',
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  eggCardActive: {
    borderColor: '#348C60',
    backgroundColor: '#EAF6F0',
  },
  eggCardLocked: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E5E5E5',
    opacity: 0.75,
  },
  eggPreview: {
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eggLockedBox: {
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  eggSilhouette: {
    fontSize: 36,
    opacity: 0.35,
  },
  eggName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#256E4A',
    textAlign: 'center',
  },
  eggNameLocked: {
    fontSize: 10,
    fontWeight: '700',
    color: '#888',
    textAlign: 'center',
  },
  eggStatus: {
    fontSize: 9,
    fontWeight: '800',
    color: '#348C60',
    textTransform: 'uppercase',
  },
  eggStatusLocked: {
    fontSize: 9,
    fontWeight: '700',
    color: '#999',
  },
  continueBtn: {
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  continueBtnActive: {
    backgroundColor: '#348C60',
    shadowColor: '#348C60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueBtnDisabled: {
    backgroundColor: '#DCD9D2',
  },
  continueBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  cityPickerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
  },
  cityPickerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2E7D5B',
    marginBottom: 14,
    textAlign: 'center',
  },
  cityItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFEA',
  },
  cityItemActive: {
    backgroundColor: '#EAF6F0',
    borderRadius: 8,
  },
  cityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  cityTextActive: {
    fontWeight: '800',
    color: '#2E7D5B',
  },
  cityCancelBtn: {
    marginTop: 14,
    paddingVertical: 10,
    backgroundColor: '#F3EFEA',
    borderRadius: 12,
    alignItems: 'center',
  },
  cityCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
  },
});
