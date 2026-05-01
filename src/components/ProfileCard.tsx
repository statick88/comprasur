import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

import { IMAGES } from '../data/mockData';

type Props = {
  name: string;
  email?: string;
  avatarUrl?: string;
  location?: string;
};

export default function ProfileCard({ name, email, avatarUrl, location }: Props) {
  const getAvatarSource = () => {
    if (!avatarUrl) return null;
    if (avatarUrl.includes('http')) return { uri: avatarUrl };
    
    // Check if it's a local key
    const key = avatarUrl.split('.')[0] as keyof typeof IMAGES;
    return IMAGES[key] || null;
  };

  const source = getAvatarSource();

  return (
    <View style={styles.card}>
      {source ? (
        <Image source={source} style={styles.avatar} />
      ) : (
        <View style={styles.avatarFallback}>
          <MaterialCommunityIcons name="account" size={30} color={theme.colors.blueDeep} />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        {email ? <Text style={styles.detail}>{email}</Text> : null}
        {location ? <Text style={styles.detail}>{location}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.subtle,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.cyanSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    color: theme.colors.blueDeep,
  },
  detail: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
});

