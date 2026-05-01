import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as WebBrowser from 'expo-web-browser';
import { createPayPalOrder, capturePayPalOrder } from '../../data/api';
import { useCartStore } from '../../store/useCartStore';
import { useUserStore } from '../../store/useUserStore';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';
import { AppHeader, EmptyState, InputField, PrimaryButton, SectionTitle } from '../../components';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Checkout'> };
type PaymentStatus = 'idle' | 'success' | 'error';

export default function CheckoutScreen({ navigation }: Props) {
  const { items, clearCart } = useCartStore();
  const { name, location } = useUserStore();
  const [buyerName, setBuyerName] = useState(name);
  const [buyerLocation, setBuyerLocation] = useState(location);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const total = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items]
  );

  const handlePay = async () => {
    if (!buyerName.trim() || !buyerLocation.trim() || !address.trim()) {
      setStatus('error');
      setStatusMessage('Completa todos los campos antes de continuar.');
      return;
    }

    try {
      setLoading(true);
      setStatus('idle');

      const order = await createPayPalOrder({
        user_name: buyerName,
        user_location: `${buyerLocation} - ${address}`,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      if (!order.approve_url || !order.paypal_order_id) {
        throw new Error('No se pudo inicializar el pago');
      }

      const result = await WebBrowser.openAuthSessionAsync(order.approve_url);
      if (result.type !== 'success' || !result.url || !result.url.includes('success')) {
        throw new Error('El pago fue cancelado');
      }

      const captureResult = await capturePayPalOrder(order.paypal_order_id);
      if (captureResult.status !== 'COMPLETED') {
        throw new Error(`Estado del pago: ${captureResult.status}`);
      }

      clearCart();
      setStatus('success');
      setStatusMessage(`Pago confirmado. Transacción: ${captureResult.transaction_id}`);
    } catch (e: any) {
      setStatus('error');
      setStatusMessage(e.message || 'No se pudo completar el pago.');
      Alert.alert('Error de pago', e.message || 'No se pudo completar el pago.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Checkout" subtitle="Finaliza tu compra" onBackPress={navigation.goBack} />
      {items.length === 0 ? (
        <EmptyState
          icon="check-circle-outline"
          title="No hay productos por pagar"
          description="Regresa al catálogo y agrega productos al carrito."
        />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <SectionTitle title="Datos de facturación" />
            <InputField label="Nombre completo" value={buyerName} onChangeText={setBuyerName} />
            <InputField label="Ubicación" value={buyerLocation} onChangeText={setBuyerLocation} />
            <InputField label="Dirección de entrega" value={address} onChangeText={setAddress} />
          </View>

          <View style={styles.card}>
            <SectionTitle title="Resumen" subtitle="Método de pago: PayPal" />
            {items.map((item) => (
              <View key={item.id} style={styles.row}>
                <Text style={styles.itemLabel}>{item.name} x{item.quantity}</Text>
                <Text style={styles.itemValue}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total a pagar</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>

          {status !== 'idle' ? (
            <View style={[styles.statusBox, status === 'success' ? styles.statusSuccess : styles.statusError]}>
              <Text style={[styles.statusText, status === 'success' ? styles.statusTextSuccess : styles.statusTextError]}>
                {statusMessage}
              </Text>
            </View>
          ) : null}

          <PrimaryButton
            title="Pagar con PayPal"
            icon="credit-card-check-outline"
            loading={loading}
            onPress={handlePay}
          />
        </ScrollView>
      )}
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
  card: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  itemValue: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '700',
    color: theme.colors.blueDeep,
  },
  totalRow: {
    marginTop: theme.spacing.xs,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    color: theme.colors.blueDeep,
  },
  totalValue: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '800',
    color: theme.colors.blueDeep,
  },
  statusBox: {
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  statusSuccess: {
    borderColor: theme.colors.success,
    backgroundColor: '#E8F5E9',
  },
  statusError: {
    borderColor: theme.colors.error,
    backgroundColor: '#FDECEC',
  },
  statusText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
  },
  statusTextSuccess: {
    color: theme.colors.success,
  },
  statusTextError: {
    color: theme.colors.error,
  },
});

