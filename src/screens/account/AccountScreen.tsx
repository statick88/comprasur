import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUserStore } from '../../store/useUserStore';
import { useCartStore } from '../../store/useCartStore';
import { uploadImageToCloudinary } from '../../lib/cloudinary';
import { theme } from '../../theme';
import { AppHeader, InputField, PrimaryButton, ProfileCard, SecondaryButton, SectionTitle } from '../../components';
import { RootStackParamList } from '../../types/navigation';

export default function AccountScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { name, location, logout, avatar_url, email, setUser } = useUserStore();
  const clearCart = useCartStore((s) => s.clearCart);
  const [nameValue, setNameValue] = useState(name);
  const [locationValue, setLocationValue] = useState(location);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleLogout = () => {
    clearCart();
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handlePickAndUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Necesitamos acceso a tus fotos para actualizar el avatar.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets[0]) {
        return;
      }

      setUploading(true);
      const uploadResult = await uploadImageToCloudinary(result.assets[0].uri);
      setUser({
        name: nameValue,
        location: locationValue,
        email,
        avatar_url: uploadResult.secure_url,
      });
      Alert.alert('Éxito', 'Foto de perfil actualizada.');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo actualizar la imagen.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setUser({
        name: nameValue.trim() || name,
        location: locationValue.trim() || location,
        email,
        avatar_url,
      });
      Alert.alert('Perfil actualizado', 'Tus datos se guardaron correctamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Cuenta" subtitle="Gestiona tu perfil y configuración" />
      <ScrollView contentContainerStyle={styles.content}>
        <ProfileCard name={name} email={email} avatarUrl={avatar_url} location={location} />
        <Pressable onPress={handlePickAndUpload} style={styles.photoBtn}>
          {uploading ? (
            <ActivityIndicator color={theme.colors.blueDeep} />
          ) : (
            <>
              <MaterialCommunityIcons name="camera-outline" size={18} color={theme.colors.blueDeep} />
              <Text style={styles.photoBtnText}>Cambiar foto de perfil</Text>
            </>
          )}
        </Pressable>

        <View style={styles.form}>
          <SectionTitle title="Datos personales" />
          <InputField label="Nombre" value={nameValue} onChangeText={setNameValue} placeholder="Tu nombre" />
          <InputField
            label="Ubicación"
            value={locationValue}
            onChangeText={setLocationValue}
            placeholder="Ciudad, Provincia, País"
          />
          <InputField
            label="Correo"
            value={email || ''}
            editable={false}
            placeholder="Sin correo registrado"
          />
          <PrimaryButton title="Guardar cambios" onPress={handleSaveProfile} loading={saving} />
        </View>

        <View style={styles.options}>
          <SectionTitle title="Opciones" subtitle="Configuración y soporte" />
          {[
            { icon: 'package-variant-closed', label: 'Pedidos' },
            { icon: 'map-marker-outline', label: 'Direcciones' },
            { icon: 'credit-card-outline', label: 'Métodos de pago' },
            { icon: 'help-circle-outline', label: 'Soporte' },
          ].map(({ icon, label }) => (
            <Pressable
              key={label}
              style={styles.optionRow}
              onPress={() => Alert.alert('Próximamente', `${label} estará disponible pronto.`)}
              accessibilityRole="button"
            >
              <MaterialCommunityIcons name={icon as any} size={20} color={theme.colors.blue} />
              <Text style={styles.optionText}>{label}</Text>
              <MaterialCommunityIcons name="chevron-right" size={18} color={theme.colors.textSecondary} style={styles.chevron} />
            </Pressable>
          ))}
        </View>

        <SecondaryButton title="Cerrar sesión" icon="logout" onPress={handleLogout} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 40,
    gap: theme.spacing.md,
  },
  photoBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.cyanSoft,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  photoBtnText: {
    color: theme.colors.blueDeep,
    fontWeight: '600',
    fontSize: theme.fontSizes.sm,
  },
  form: {
    gap: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
  },
  options: {
    gap: theme.spacing.xs,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  optionText: {
    flex: 1,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  chevron: {
    marginLeft: 'auto' as any,
  },
});
