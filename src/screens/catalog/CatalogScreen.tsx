import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Product, getProductImage } from '../../data/mockData';
import { fetchProducts, searchProducts } from '../../data/api';
import { useCartStore } from '../../store/useCartStore';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';
import {
  AppHeader,
  CategoryChip,
  EmptyState,
  ErrorState,
  LoadingState,
  ProductCard,
  SectionTitle,
} from '../../components';
import { UICopy } from '../../../specs/ui-copy';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = (width - 48 - CARD_GAP) / 2;
const CATEGORY_OPTIONS = ['Todos', 'Protección', 'Inyección', 'Quirúrgico', 'Curación', 'Hospitalario'];

type Props = { navigation: NativeStackNavigationProp<RootStackParamList> };
type CatalogProduct = Product & { category: string; stock: number };

function transformProduct(apiProduct: any, index: number): CatalogProduct {
  const fallbackCategories = ['Protección', 'Protección', 'Inyección', 'Quirúrgico', 'Curación', 'Hospitalario'];
  const fallbackColors = [
    { primary: '#2B6CB0', background: '#EBF8FF', text: '#1A365D', accent: '#BEE3F8' },
    { primary: '#276749', background: '#F0FFF4', text: '#1C4532', accent: '#C6F6D5' },
    { primary: '#C05621', background: '#FFFAF0', text: '#7B341E', accent: '#FEEBC8' },
    { primary: '#702459', background: '#FFF5F7', text: '#521B41', accent: '#FED7E2' },
    { primary: '#D69E2E', background: '#FFFFF0', text: '#744210', accent: '#FEFCBF' },
    { primary: '#553C9A', background: '#FAF5FF', text: '#322659', accent: '#E9D8FD' },
  ];
  const imageKeys = ['guantes_nitrilo', 'mascarilla_n95', 'jeringa_10ml', 'bisturi_quirurgico', 'vendaje_elastico', 'cateter_intravenoso'];
  const imageAlts = [
    'Guantes desechables clínicos',
    'Mascarilla de protección respiratoria',
    'Jeringa desechable de precisión',
    'Instrumento de corte estéril',
    'Rollo de vendaje adaptable',
    'Catéter flexible médico',
  ];

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    price: Number.parseFloat(apiProduct.price),
    description: apiProduct.description,
    imageKey: imageKeys[index % imageKeys.length],
    imageAlt: imageAlts[index % imageAlts.length],
    category: fallbackCategories[index % fallbackCategories.length],
    stock: Math.max(20 - index * 2, 1),
    colors: fallbackColors[index % fallbackColors.length],
  };
}

export default function CatalogScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});
  const addItem = useCartStore((s) => s.addItem);

  const loadProducts = useCallback(async (search = '') => {
    try {
      setLoading(true);
      setError(null);
      const data = search.trim() ? await searchProducts(search) : await fetchProducts();
      setProducts(data.map((p: any, i: number) => transformProduct(p, i)));
    } catch (err: any) {
      setError(err.message || 'No se pudieron cargar los productos.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filtered = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
      return matchesCategory;
    });
  }, [products, selectedCategory]);

  const handleSearch = async (text: string) => {
    setQuery(text);
    await loadProducts(text);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Catálogo" subtitle="Explora insumos médicos" />
      <View style={styles.content}>
        <SectionTitle title={UICopy.catalogTitle} subtitle="Rápido, claro y con stock visible." />
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={handleSearch}
            placeholder="Buscar producto..."
            placeholderTextColor={theme.colors.textSecondary}
            accessibilityLabel="Buscar producto"
          />
          {query ? (
            <MaterialCommunityIcons
              name="close-circle-outline"
              size={18}
              color={theme.colors.textSecondary}
              onPress={() => handleSearch('')}
            />
          ) : null}
        </View>
        <FlatList
          horizontal
          data={CATEGORY_OPTIONS}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.chips}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryChip label={item} selected={item === selectedCategory} onPress={() => setSelectedCategory(item)} />
          )}
        />

        {loading ? (
          <LoadingState message="Cargando catálogo..." />
        ) : error ? (
          <ErrorState message={error} onRetry={() => loadProducts(query)} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.list}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
            <EmptyState
                icon="medical-bag"
                title="Sin resultados"
                description="Prueba otra búsqueda o selecciona otra categoría."
              />
            }
            renderItem={({ item }) => (
              <View style={styles.cardWrap}>
                <ProductCard
                  image={getProductImage(item)}
                  name={item.name}
                  price={item.price}
                  description={item.description}
                  category={item.category}
                  accessibilityLabel={item.imageAlt}
                  inStock={item.stock > 0}
                  favorite={!!favorites[item.id]}
                  onToggleFavorite={() =>
                    setFavorites((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                  }
                  onQuickAction={() => addItem(item)}
                  onPress={() => navigation.navigate('ProductInfo', { productId: item.id })}
                />
              </View>
            )}
          />
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
    gap: theme.spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  searchInput: {
    flex: 1,
    minHeight: theme.interaction.minTouchSize + 2,
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.md,
  },
  chips: {
    paddingVertical: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  list: {
    paddingBottom: 120,
    paddingTop: theme.spacing.xs,
  },
  row: {
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  cardWrap: {
    width: CARD_WIDTH,
  },
});
