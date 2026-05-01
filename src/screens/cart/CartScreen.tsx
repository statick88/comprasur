import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCartStore } from '../../store/useCartStore';
import { getProductImage } from '../../data/mockData';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';
import { AppHeader, CartItem, EmptyState, PrimaryButton, SectionTitle } from '../../components';
import { UICopy } from '../../../specs/ui-copy';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList> };

export default function CartScreen({ navigation }: Props) {
  const { items, increaseItem, decreaseItem, removeItem } = useCartStore();
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping: number = 0;
  const total = subtotal + shipping;

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Carrito" subtitle="Controla tus productos antes de pagar" />
      <View style={styles.content}>
        {items.length === 0 ? (
          <EmptyState
            icon="cart-outline"
            title="Tu carrito está vacío"
            description="Agrega productos desde el catálogo para empezar."
          />
        ) : (
          <>
            <FlatList
              data={items}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <CartItem
                  name={item.name}
                  price={item.price}
                  quantity={item.quantity}
                  subtotal={item.price * item.quantity}
                  image={getProductImage(item.id)}
                  onIncrease={() => increaseItem(item.id)}
                  onDecrease={() => decreaseItem(item.id)}
                  onRemove={() => removeItem(item.id)}
                />
              )}
            />

            <View style={styles.summary}>
              <SectionTitle title="Resumen de compra" />
              <View style={styles.row}>
                <Text style={styles.label}>Subtotal</Text>
                <Text style={styles.value}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Envío</Text>
                <Text style={styles.value}>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
              <PrimaryButton title={UICopy.cartCTA} icon="credit-card-outline" onPress={() => navigation.navigate('Checkout')} />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
  },
  list: {
    paddingTop: theme.spacing.xs,
    paddingBottom: 12,
    gap: theme.spacing.sm,
  },
  summary: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  value: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.blueDeep,
    fontWeight: '700',
  },
  totalLabel: {
    fontSize: theme.fontSizes.lg,
    color: theme.colors.blueDeep,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.blueDeep,
    fontWeight: '800',
  },
});
