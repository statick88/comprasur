import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

type Props = {
  message?: string;
};

export default function LoadingState({ message = 'Cargando...' }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.blue} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  message: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
});

