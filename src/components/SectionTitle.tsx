import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { theme } from '../theme';

type Props = {
  title: string;
  subtitle?: string;
};

export default function SectionTitle({ title, subtitle }: Props) {
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...theme.typography.h3,
    color: theme.colors.blueDeep,
  },
  subtitle: {
    ...theme.typography.caption,
    marginTop: 2,
  },
});

