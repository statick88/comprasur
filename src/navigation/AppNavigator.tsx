import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, StyleSheet, Text } from 'react-native';
import LoginScreen from '../screens/auth/LoginScreen';
import CatalogScreen from '../screens/catalog/CatalogScreen';
import CartScreen from '../screens/cart/CartScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import AccountScreen from '../screens/account/AccountScreen';
import ProductInfoScreen from '../screens/product/ProductInfoScreen';
import CheckoutScreen from '../screens/checkout/CheckoutScreen';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { theme } from '../theme';
import { AppSpec } from '../../specs/app.spec';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  const cartCount = useCartStore((s) => s.items.reduce((acc, item) => acc + item.quantity, 0));

  return (
    <Tab.Navigator
      id="main-tabs"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.blueDeep,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tab.Screen
        name="Catálogo"
        component={CatalogScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-grid" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Carrito"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View>
              <MaterialCommunityIcons name="cart-outline" size={size} color={color} />
              {cartCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
                </View>
              ) : null}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chat-processing-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Cuenta"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const isGuest = useUserStore((s) => s.isGuest);
  const isAuthenticated = isLoggedIn || (AppSpec.auth.allowGuest && isGuest);

  return (
    <NavigationContainer>
      <Stack.Navigator
        id="root-stack"
        initialRouteName={isAuthenticated ? 'MainTabs' : 'Login'}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ animation: 'fade_from_bottom' }} />
            <Stack.Screen name="ProductInfo" component={ProductInfoScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ animation: 'slide_from_right' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    height: 64,
    paddingTop: 6,
    paddingBottom: 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    right: -10,
    top: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.blueDeep,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    color: theme.colors.white,
    fontWeight: '700',
  },
});
