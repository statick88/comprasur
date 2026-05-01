// src/data/mockData.ts
// Datos mockeados — Catálogo de productos médicos Comprasur
import { ImageRequireSource } from 'react-native';

// Mapeo de imágenes - usar require() para Expo
// NOTA:foto_perfil es opcional, se usa fallback si no existe
const IMAGES = {
  guantes_nitrilo: require('../../assets/images/guantes_nitrilo.png'),
  mascarilla_n95: require('../../assets/images/mascarilla_n95.png'),
  jeringa_10ml: require('../../assets/images/jeringa_10ml.png'),
  bisturi_quirurgico: require('../../assets/images/bisturi_quirurgico.png'),
  vendaje_elastico: require('../../assets/images/vendaje_elastico.png'),
  cateter_intravenoso: require('../../assets/images/cateter_intravenoso.png'),
};

// Función helper para obtener imagen con fallback
export function getProductImage(productId: number): ImageRequireSource | undefined {
  const imageMap: Record<number, ImageRequireSource> = {
    1: IMAGES.guantes_nitrilo,
    2: IMAGES.mascarilla_n95,
    3: IMAGES.jeringa_10ml,
    4: IMAGES.bisturi_quirurgico,
    5: IMAGES.vendaje_elastico,
    6: IMAGES.cateter_intravenoso,
  };
  return imageMap[productId];
}

// Profile image - returns undefined if not exists (fallback handled in component)
export function getProfileImage(): ImageRequireSource | undefined {
  try {
    return require('../../assets/images/foto_perfil.png');
  } catch {
    return undefined;
  }
}

export type ProductColor = {
  primary: string;
  background: string;
  text: string;
  accent: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  colors: ProductColor;
  imageKey: string;
  category?: string;
  stock?: number;
};

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Guantes de Nitrilo',
    price: 15,
    description: 'Guantes desechables de alta resistencia para procedimientos clínicos.',
    imageKey: 'guantes_nitrilo',
    category: 'Protección',
    stock: 120,
    colors: {
      primary: '#0077B6',
      background: '#CAF0F8',
      text: '#03045E',
      accent: '#90E0EF',
    },
  },
  {
    id: 2,
    name: 'Mascarilla N95',
    price: 25,
    description: 'Mascarilla de protección respiratoria con filtro de partículas.',
    imageKey: 'mascarilla_n95',
    category: 'Protección',
    stock: 84,
    colors: {
      primary: '#0077B6',
      background: '#CAF0F8',
      text: '#03045E',
      accent: '#90E0EF',
    },
  },
  {
    id: 3,
    name: 'Jeringa 10ml',
    price: 5,
    description: 'Jeringa desechable de precisión con émbolo suave.',
    imageKey: 'jeringa_10ml',
    category: 'Inyección',
    stock: 210,
    colors: {
      primary: '#0077B6',
      background: '#CAF0F8',
      text: '#03045E',
      accent: '#90E0EF',
    },
  },
  {
    id: 4,
    name: 'Bisturí Quirúrgico',
    price: 12,
    description: 'Instrumento de corte estéril con mango ergonómico.',
    imageKey: 'bisturi_quirurgico',
    category: 'Quirúrgico',
    stock: 43,
    colors: {
      primary: '#0077B6',
      background: '#CAF0F8',
      text: '#03045E',
      accent: '#90E0EF',
    },
  },
  {
    id: 5,
    name: 'Vendaje Elástico',
    price: 8,
    description: 'Vendaje adaptable para inmovilización y compresión muscular.',
    imageKey: 'vendaje_elastico',
    category: 'Curación',
    stock: 156,
    colors: {
      primary: '#0077B6',
      background: '#CAF0F8',
      text: '#03045E',
      accent: '#90E0EF',
    },
  },
  {
    id: 6,
    name: 'Catéter Intravenoso',
    price: 18,
    description: 'Catéter flexible para administración de fluidos y medicamentos.',
    imageKey: 'cateter_intravenoso',
    category: 'Hospitalario',
    stock: 68,
    colors: {
      primary: '#0077B6',
      background: '#CAF0F8',
      text: '#03045E',
      accent: '#90E0EF',
    },
  },
];

export const MOCK_USER = {
  name: 'Diego Medardo Saavedra García',
  location: 'Quito, Pichincha, Ecuador',
};
