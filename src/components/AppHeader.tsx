import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

type Props = {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
};

export default function AppHeader({ title, subtitle, onBackPress, rightAction }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {onBackPress ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Volver"
            onPress={onBackPress}
            style={styles.backBtn}
            activeOpacity={theme.opacity.pressed}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={theme.colors.blueDeep} />
          </TouchableOpacity>
        ) : null}
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {rightAction}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  backBtn: {
    width: theme.interaction.minTouchSize,
    height: theme.interaction.minTouchSize,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.cyanSoft,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.blueDeep,
  },
  subtitle: {
    ...theme.typography.caption,
    marginTop: 2,
  },
});

