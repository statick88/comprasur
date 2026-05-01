# SPEC.md — Comprasur App

## 1. Overview
**Nombre:** Comprasur
**Tipo:** App móvil (React Native / Expo)
**Descripción:** Aplicación móvil para la compra de insumos médicos. Frontend funcional con catálogo, carrito, chat de soporte y perfil de usuario.
**Stack:** Expo SDK 53 + React Navigation 7 + Zustand 5 + @expo/vector-icons

---

## 2. Arquitectura de Navegación

```
AppNavigator (Native Stack)
├── AuthStack (Native Stack)
│   ├── LoginScreen
│   └── ProductInfoScreen (Modal: presentation="modal")
└── MainTabs (Bottom Tab Navigator)
    ├── Tab: Catálogo → CatalogScreen
    ├── Tab: Carrito → CartScreen
    ├── Tab: Chat → ChatScreen
    └── Tab: Cuenta → AccountScreen
```

---

## 3. Datos Mock — Productos (6)

| ID | Nombre | Precio | Descripción | Colores [principal, bg, texto, acento] |
|----|--------|--------|------------|-------------------------------------|
| 1 | Guantes de Nitrilo | $15 | "Guantes desechables de alta resistencia..." | #2B6CB0, #EBF8FF, #1A365D, #BEE3F8 |
| 2 | Mascarilla N95 | $25 | "Mascarilla de protección respiratoria..." | #276749, #F0FFF4, #1C4532, #C6F6D5 |
| 3 | Jeringa 10ml | $5 | "Jeringa desechable de precisión..." | #C05621, #FFFAF0, #7B341E, #FEEBC8 |
| 4 | Bisturí Quirúrgico | $12 | "Instrumento de corte estéril..." | #702459, #FFF5F7, #521B41, #FED7E2 |
| 5 | Vendaje Elástico | $8 | "Vendaje adaptable para inmovilización..." | #D69E2E, #FFFFF0, #744210, #FEFCBF |
| 6 | Catéter Intravenoso | $18 | "Catéter flexible para administración..." | #553C9A, #FAF5FF, #322659, #E9D8FD |

---

## 4. Datos Mock — Usuario

- **Nombre:** Diego Medardo Saavedra García
- **Ubicación:** Quito, Pichincha, Ecuador

---

## 5. Pantallas

### 5.1 LoginScreen (Auth Stack)
- Título "Comprasur" centrado (fontSize: 32, bold)
- Botón "Iniciar con Google" (fondo #2B6CB0, borderRadius 12)
- Botón "Entrar sin iniciar sesión" (texto, color #2B6CB0)
- Ambos → `navigation.replace('MainTabs')`

### 5.2 CatalogScreen (Tab)
- Título "¿Qué vas a llevar hoy?" centrado
- SearchBar funcional (filtra por nombre)
- FlatList numColumns=2, gap 12
- Card: Placeholder (color principal), nombre, precio

### 5.3 ProductInfoScreen (Modal)
- Placeholder coloreado (color principal)
- Precio grande
- Descripción completa
- 4 círculos de color (extraídos del mock)
- Botón "Añadir al carrito" → Store + goBack()

### 5.4 CartScreen (Tab)
- FlatList 1 columna
- Item: nombre + precio + botón eliminar
- Total calculado
- Botón "Adquirir" (disabled si vacío)

### 5.5 ChatScreen (Tab)
- FlatList mensajes (izq=soporte, der=usuario)
- Input fijo abajo + botón enviar
- Auto-respuesta "Soporte Comprasur" a los 2 segundos

### 5.6 AccountScreen (Tab)
- Avatar circular (80px, placeholder)
- TextInput nombre (precargado)
- TextInput ubicación (precargado)
- Botón "Cerrar sesión" → logout + Login

---

## 6. Stores (Zustand)

### useCartStore
```typescript
{
  items: CartItem[],
  addItem: (product: Product) => void,
  removeItem: (id: number) => void,
  clearCart: () => void,
}
```

### useUserStore
```typescript
{
  name: string,
  location: string,
  isLoggedIn: boolean,
  login: () => void,
  logout: () => void,
  updateProfile: (data) => void,
}
```

### useChatStore
```typescript
{
  messages: Message[],
  sendMessage: (text: string) => void,
  addBotResponse: (text: string) => void,
}
```

---

## 7. Estilos Globales

| Token | Valor |
|-------|-------|
| Primary | #2B6CB0 |
| Background | #FFFFFF |
| Text Primary | #1A365D |
| Text Secondary | #718096 |
| Border | #E2E8F0 |
| Success | #27A143 |
| Danger | #E53E3E |