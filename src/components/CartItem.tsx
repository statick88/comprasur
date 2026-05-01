import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

type Props = {
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  image?: any;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export default function CartItem({
  name,
  price,
  quantity,
  subtotal,
  image,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) {
  return (
    <View style={styles.container}>
      {image ? (
        <Image source={image} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, styles.placeholder]}>
          <MaterialCommunityIcons name="medical-bag" size={22} color={theme.colors.blue} />
        </View>
      )}
      <View style={styles.info}>
        <Text numberOfLines={2} style={styles.name}>
          {name}
        </Text>
        <Text style={styles.price}>${price.toFixed(2)} c/u</Text>
        <View style={styles.qtyRow}>
          <Pressable
            onPress={onDecrease}
            style={styles.qtyBtn}
            accessibilityRole="button"
            accessibilityLabel={`Disminuir cantidad de ${name}`}>
            <MaterialCommunityIcons name="minus" size={18} color={theme.colors.blueDeep} />
          </Pressable>
          <Text style={styles.qtyText}>{quantity}</Text>
          <Pressable
            onPress={onIncrease}
            style={styles.qtyBtn}
            accessibilityRole="button"
            accessibilityLabel={`Aumentar cantidad de ${name}`}>
            <MaterialCommunityIcons name="plus" size={18} color={theme.colors.blueDeep} />
          </Pressable>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.subtotal}>${subtotal.toFixed(2)}</Text>
        <Pressable
          onPress={onRemove}
          style={styles.removeBtn}
          accessibilityRole="button"
          accessibilityLabel={`Eliminar ${name} del carrito`}>
          <MaterialCommunityIcons name="trash-can-outline" size={20} color={theme.colors.error} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    ...theme.shadows.subtle,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.cyanSoft,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  price: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
  },
  qtyRow: {
    marginTop: theme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.cyanSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    minWidth: 20,
    textAlign: 'center',
    fontWeight: '700',
    color: theme.colors.blueDeep,
  },
  right: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  subtotal: {
    fontSize: theme.fontSizes.md,
    fontWeight: '800',
    color: theme.colors.blueDeep,
  },
  removeBtn: {
    padding: 4,
  },
});

