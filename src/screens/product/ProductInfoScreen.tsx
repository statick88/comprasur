import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PRODUCTS, getProductImage } from '../../data/mockData';
import { useCartStore } from '../../store/useCartStore';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';
import { AppHeader, PrimaryButton, SectionTitle } from '../../components';
import { AppSpec } from '../../../specs/app.spec';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProductInfo'>;
  route: RouteProp<RootStackParamList, 'ProductInfo'>;
};

export default function ProductInfoScreen({ navigation, route }: Props) {
  const { productId } = route.params;
  const product = PRODUCTS.find((p) => p.id === productId) ?? PRODUCTS[0];
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showColorError, setShowColorError] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const colorOptions = useMemo(
    () =>
      [product.colors.primary, product.colors.background, product.colors.accent, product.colors.text].slice(
        0,
        AppSpec.product.colorOptions
      ),
    [product.colors]
  );
  const image = getProductImage(product);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Detalle de producto" subtitle="Información y compra" onBackPress={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.content}>
        {image ? (
          <Image 
            source={image} 
            style={styles.image} 
            resizeMode="cover" 
            accessibilityLabel={product.imageAlt}
          />
        ) : (
          <View style={styles.imageFallback}>
            <MaterialCommunityIcons name="medical-bag" size={70} color={theme.colors.blueDeep} />
          </View>
        )}
        <View style={styles.section}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        <View style={styles.section}>
          <SectionTitle title="Colores" subtitle="Selecciona uno para continuar." />
          <View style={styles.colors}>
            {colorOptions.map((color, index) => (
              <Pressable
                key={`${color}-${index}`}
                onPress={() => {
                  setSelectedColor(color);
                  setShowColorError(false);
                }}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorOptionSelected,
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedColor === color }}
                accessibilityLabel={`Seleccionar color ${index + 1}`}
              />
            ))}
          </View>
          {showColorError && AppSpec.product.mustSelectColor ? (
            <Text style={styles.errorText}>Debes seleccionar un color para continuar.</Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <SectionTitle title="Cantidad" />
          <View style={styles.quantityRow}>
            <Pressable onPress={() => setQuantity((q) => Math.max(q - 1, 1))} style={styles.qtyBtn}>
              <MaterialCommunityIcons name="minus" size={20} color={theme.colors.blueDeep} />
            </Pressable>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <Pressable onPress={() => setQuantity((q) => q + 1)} style={styles.qtyBtn}>
              <MaterialCommunityIcons name="plus" size={20} color={theme.colors.blueDeep} />
            </Pressable>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLine}>Categoría: {product.category || 'General'}</Text>
          <Text style={styles.infoLine}>Stock disponible: {product.stock || 50}</Text>
          <Text style={styles.infoLine}>Entrega estimada: 24 - 48 horas</Text>
        </View>

        <PrimaryButton
          title={`Agregar ${quantity} al carrito`}
          icon="cart-plus"
          disabled={AppSpec.product.mustSelectColor && !selectedColor}
          onPress={() => {
            if (AppSpec.product.mustSelectColor && !selectedColor) {
              setShowColorError(true);
              return;
            }
            addItem(product, quantity);
            navigation.goBack();
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
    paddingBottom: 40,
  },
  image: {
    width: '100%',
    height: 230,
    borderRadius: theme.radius.lg,
  },
  imageFallback: {
    width: '100%',
    height: 230,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.cyanSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    gap: theme.spacing.xs,
  },
  name: {
    ...theme.typography.h2,
  },
  price: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: '800',
    color: theme.colors.blueDeep,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 23,
  },
  colors: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: theme.colors.blueDeep,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSizes.sm,
    marginTop: theme.spacing.xs,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.cyanSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyValue: {
    minWidth: 28,
    textAlign: 'center',
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    color: theme.colors.blueDeep,
  },
  infoCard: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  infoLine: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
});
