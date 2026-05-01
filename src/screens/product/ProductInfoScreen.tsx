import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PRODUCTS, getProductImage, Product } from '../../data/mockData';
import { fetchProduct } from '../../data/api';
import { useCartStore } from '../../store/useCartStore';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';
import { AppHeader, LoadingState, PrimaryButton, SectionTitle } from '../../components';
import { AppSpec } from '../../../specs/app.spec';

type CatalogProduct = Product & { category: string; stock: number };

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProductInfo'>;
  route: RouteProp<RootStackParamList, 'ProductInfo'>;
};

function apiToProduct(apiProduct: any): CatalogProduct {
  const fallbackColors = [
    { primary: '#2B6CB0', background: '#EBF8FF', text: '#1A365D', accent: '#BEE3F8' },
    { primary: '#276749', background: '#F0FFF4', text: '#1C4532', accent: '#C6F6D5' },
    { primary: '#C05621', background: '#FFFAF0', text: '#7B341E', accent: '#FEEBC8' },
    { primary: '#702459', background: '#FFF5F7', text: '#521B41', accent: '#FED7E2' },
    { primary: '#D69E2E', background: '#FFFFF0', text: '#744210', accent: '#FEFCBF' },
    { primary: '#553C9A', background: '#FAF5FF', text: '#322659', accent: '#E9D8FD' },
  ];
  const imageKeys = ['guantes_nitrilo', 'mascarilla_n95', 'jeringa_10ml', 'bisturi_quirurgico', 'vendaje_elastico', 'cateter_intravenoso'];
  const idx = (apiProduct.id - 1) % 6;
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    price: Number.parseFloat(apiProduct.price),
    description: apiProduct.description,
    imageKey: imageKeys[idx],
    imageAlt: apiProduct.name,
    category: apiProduct.category || 'General',
    stock: apiProduct.stock ?? 50,
    colors: {
      primary: apiProduct.color_primary || fallbackColors[idx].primary,
      background: apiProduct.color_background || fallbackColors[idx].background,
      text: apiProduct.color_text || fallbackColors[idx].text,
      accent: apiProduct.color_accent || fallbackColors[idx].accent,
    },
  };
}

export default function ProductInfoScreen({ navigation, route }: Props) {
  const { productId } = route.params;
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showColorError, setShowColorError] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetchProduct(productId)
      .then((data: any) => setProduct(apiToProduct(data)))
      .catch(() => {
        // Fallback a mock si la API falla
        const mock = PRODUCTS.find((p) => p.id === productId) ?? PRODUCTS[0];
        setProduct({ ...mock, category: mock.category || 'General', stock: mock.stock ?? 50 });
      })
      .finally(() => setLoading(false));
  }, [productId]);

  const colorOptions = useMemo(
    () =>
      product
        ? [product.colors.primary, product.colors.background, product.colors.accent, product.colors.text].slice(
            0,
            AppSpec.product.colorOptions
          )
        : [],
    [product]
  );

  if (loading || !product) return <LoadingState message="Cargando producto..." />;

  const image = getProductImage(product);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Detalle de producto" subtitle="Información y compra" onBackPress={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.content}>
        {image ? (
          <Image source={image} style={styles.image} resizeMode="cover" accessibilityLabel={product.imageAlt} />
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
                onPress={() => { setSelectedColor(color); setShowColorError(false); }}
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
          <Text style={styles.infoLine}>Categoría: {product.category}</Text>
          <Text style={styles.infoLine}>Stock disponible: {product.stock}</Text>
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
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.xl, gap: theme.spacing.lg, paddingBottom: 40 },
  image: { width: '100%', height: 230, borderRadius: theme.radius.lg },
  imageFallback: {
    width: '100%',
    height: 230,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.cyanSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: { gap: theme.spacing.xs },
  name: { ...theme.typography.h2 },
  price: { fontSize: theme.fontSizes.xxl, fontWeight: '800', color: theme.colors.blueDeep },
  description: { ...theme.typography.body, color: theme.colors.textSecondary, lineHeight: 23 },
  colors: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, marginTop: theme.spacing.xs },
  colorOption: { width: 36, height: 36, borderRadius: theme.radius.pill, borderWidth: 1, borderColor: theme.colors.border },
  colorOptionSelected: { borderWidth: 3, borderColor: theme.colors.blueDeep },
  errorText: { color: theme.colors.error, fontSize: theme.fontSizes.sm, marginTop: theme.spacing.xs },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, marginTop: theme.spacing.xs },
  qtyBtn: {
    width: 40, height: 40, borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.cyanSoft, justifyContent: 'center', alignItems: 'center',
  },
  qtyValue: { minWidth: 28, textAlign: 'center', fontSize: theme.fontSizes.lg, fontWeight: '700', color: theme.colors.blueDeep },
  infoCard: {
    borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md,
    backgroundColor: theme.colors.white, padding: theme.spacing.md, gap: theme.spacing.xs,
  },
  infoLine: { fontSize: theme.fontSizes.sm, color: theme.colors.textSecondary },
});
