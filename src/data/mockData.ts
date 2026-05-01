// src/data/mockData.ts
import { ImageRequireSource } from 'react-native';

export const IMAGES = {
  guantes_nitrilo: require('../../assets/images/guantes_nitrilo.png'),
  mascarilla_n95: require('../../assets/images/mascarilla_n95.png'),
  jeringa_10ml: require('../../assets/images/jeringa_10ml.png'),
  bisturi_quirurgico: require('../../assets/images/bisturi_quirurgico.png'),
  vendaje_elastico: require('../../assets/images/vendaje_elastico.png'),
  cateter_intravenoso: require('../../assets/images/cateter_intravenoso.png'),
  foto_perfil: require('../../assets/images/foto_perfil.png'),
};

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
  imageAlt: string;
  colors: ProductColor;
  imageKey: string;
  category?: string;
  stock?: number;
};

export function getProductImage(product: Product): any {
  try {
    const key = product.imageKey as keyof typeof IMAGES;
    if (IMAGES[key]) return IMAGES[key];
    throw new Error('not found');
  } catch {
    const color = product.colors.primary.replace('#', '');
    return { uri: `https://via.placeholder.com/400/${color}/FFFFFF?text=${encodeURIComponent(product.name)}` };
  }
}

export function getProfileImage(): any {
  try {
    if (IMAGES.foto_perfil) return IMAGES.foto_perfil;
    throw new Error('not found');
  } catch {
    return { uri: 'https://via.placeholder.com/200/2B6CB0/FFFFFF?text=Perfil' };
  }
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Guantes de Nitrilo',
    price: 15,
    description: 'Guantes desechables de alta resistencia para procedimientos clínicos.',
    imageAlt: 'Guantes desechables clínicos',
    imageKey: 'guantes_nitrilo',
    category: 'Protección',
    stock: 120,
    colors: {
      primary: '#2B6CB0',
      background: '#EBF8FF',
      text: '#1A365D',
      accent: '#BEE3F8',
    },
  },
  {
    id: 2,
    name: 'Mascarilla N95',
    price: 25,
    description: 'Mascarilla de protección respiratoria con filtro de partículas.',
    imageAlt: 'Mascarilla de protección respiratoria',
    imageKey: 'mascarilla_n95',
    category: 'Protección',
    stock: 84,
    colors: {
      primary: '#276749',
      background: '#F0FFF4',
      text: '#1C4532',
      accent: '#C6F6D5',
    },
  },
  {
    id: 3,
    name: 'Jeringa 10ml',
    price: 5,
    description: 'Jeringa desechable de precisión con émbolo suave.',
    imageAlt: 'Jeringa desechable de precisión',
    imageKey: 'jeringa_10ml',
    category: 'Inyección',
    stock: 210,
    colors: {
      primary: '#C05621',
      background: '#FFFAF0',
      text: '#7B341E',
      accent: '#FEEBC8',
    },
  },
  {
    id: 4,
    name: 'Bisturí Quirúrgico',
    price: 12,
    description: 'Instrumento de corte estéril con mango ergonómico.',
    imageAlt: 'Instrumento de corte estéril',
    imageKey: 'bisturi_quirurgico',
    category: 'Quirúrgico',
    stock: 43,
    colors: {
      primary: '#702459',
      background: '#FFF5F7',
      text: '#521B41',
      accent: '#FED7E2',
    },
  },
  {
    id: 5,
    name: 'Vendaje Elástico',
    price: 8,
    description: 'Vendaje adaptable para inmovilización y compresión muscular.',
    imageAlt: 'Rollo de vendaje adaptable',
    imageKey: 'vendaje_elastico',
    category: 'Curación',
    stock: 156,
    colors: {
      primary: '#D69E2E',
      background: '#FFFFF0',
      text: '#744210',
      accent: '#FEFCBF',
    },
  },
  {
    id: 6,
    name: 'Catéter Intravenoso',
    price: 18,
    description: 'Catéter flexible para administración de fluidos y medicamentos.',
    imageAlt: 'Catéter flexible médico',
    imageKey: 'cateter_intravenoso',
    category: 'Hospitalario',
    stock: 68,
    colors: {
      primary: '#553C9A',
      background: '#FAF5FF',
      text: '#322659',
      accent: '#E9D8FD',
    },
  },
];

export const MOCK_USER = {
  name: 'Diego Medardo Saavedra García',
  location: 'Quito, Pichincha, Ecuador',
  avatar_url: 'foto_perfil.png',
};