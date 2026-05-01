import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

type Props = {
  image?: any;
  name: string;
  price: number;
  description?: string;
  category?: string;
  favorite?: boolean;
  inStock?: boolean;
  accessibilityLabel?: string;
  onPress: () => void;
  onQuickAction?: () => void;
  onToggleFavorite?: () => void;
};

export default function ProductCard({
  image,
  name,
  price,
  description,
  category,
  favorite = false,
  inStock = true,
  accessibilityLabel,
  onPress,
  onQuickAction,
  onToggleFavorite,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      {image ? (
        <Image 
          source={image} 
          style={styles.image} 
          resizeMode="cover" 
          accessibilityLabel={accessibilityLabel || name}
        />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <MaterialCommunityIcons name="medical-bag" size={34} color={theme.colors.blue} />
        </View>
      )}
      <View style={styles.badges}>
        {category ? <Text style={styles.categoryBadge}>{category}</Text> : null}
        <Text style={[styles.stockBadge, !inStock && styles.stockBadgeOff]}>
          {inStock ? 'Disponible' : 'Sin stock'}
        </Text>
      </View>
      {onToggleFavorite ? (
        <Pressable
          onPress={onToggleFavorite}
          accessibilityRole="button"
          accessibilityLabel={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          style={styles.favoriteBtn}>
          <MaterialCommunityIcons
            name={favorite ? 'heart' : 'heart-outline'}
            size={18}
            color={favorite ? theme.colors.blueDeep : theme.colors.blue}
          />
        </Pressable>
      ) : null}
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.name}>
          {name}
        </Text>
        {!!description && (
          <Text numberOfLines={2} style={styles.description}>
            {description}
          </Text>
        )}
        <View style={styles.footer}>
          <Text style={styles.price}>${price.toFixed(2)}</Text>
          {onQuickAction ? (
            <Pressable
              onPress={onQuickAction}
              accessibilityRole="button"
              accessibilityLabel="Agregar al carrito"
              style={styles.quickButton}>
              <MaterialCommunityIcons name="cart-plus" size={18} color={theme.colors.white} />
            </Pressable>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.subtle,
  },
  pressed: {
    opacity: theme.opacity.pressed,
  },
  image: {
    width: '100%',
    height: 118,
  },
  imagePlaceholder: {
    backgroundColor: theme.colors.cyanSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badges: {
    position: 'absolute',
    left: theme.spacing.xs,
    top: theme.spacing.xs,
    gap: 4,
  },
  categoryBadge: {
    backgroundColor: theme.colors.cyanSoft,
    color: theme.colors.blueDeep,
    fontSize: theme.fontSizes.xs,
    fontWeight: '700',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.radius.pill,
    alignSelf: 'flex-start',
  },
  stockBadge: {
    backgroundColor: theme.colors.white,
    color: theme.colors.blue,
    fontSize: theme.fontSizes.xs,
    fontWeight: '700',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.radius.pill,
    alignSelf: 'flex-start',
  },
  stockBadgeOff: {
    color: theme.colors.error,
  },
  favoriteBtn: {
    position: 'absolute',
    right: theme.spacing.xs,
    top: theme.spacing.xs,
    width: 32,
    height: 32,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: theme.spacing.sm,
    gap: 4,
  },
  name: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  description: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  footer: {
    marginTop: theme.spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: theme.fontSizes.md,
    fontWeight: '800',
    color: theme.colors.blueDeep,
  },
  quickButton: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

