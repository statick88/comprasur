import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

type Props = {
  title: string;
  description: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
};

export default function EmptyState({ title, description, icon = 'inbox-outline' }: Props) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={58} color={theme.colors.blue} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    color: theme.colors.blueDeep,
    textAlign: 'center',
  },
  description: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

