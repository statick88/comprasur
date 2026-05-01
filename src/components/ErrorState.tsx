import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

type Props = {
  message?: string;
  onRetry?: () => void;
};

export default function ErrorState({ 
  message = 'Ocurrió un error inesperado.', 
  onRetry 
}: Props) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons 
        name="alert-circle-outline" 
        size={48} 
        color={theme.colors.danger} 
      />
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  message: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  button: {
    backgroundColor: theme.colors.blue,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
  },
  buttonText: {
    color: theme.colors.white,
    fontWeight: '700',
    fontSize: theme.fontSizes.md,
  },
});
