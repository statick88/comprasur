// src/data/config.js
import { Platform } from 'react-native';

// In a real production app, use react-native-dotenv or expo-constants/extra
// For this project, we prioritize flexibility for the developer's environment.

const LOCAL_IP = process.env.EXPO_PUBLIC_API_HOST || 'localhost';

export const API_URL = __DEV__
  ? `http://${LOCAL_IP}:3000`
  : (process.env.EXPO_PUBLIC_API_URL || `http://${LOCAL_IP}:3000`);

console.log(`[Config] API_URL set to: ${API_URL}`);
