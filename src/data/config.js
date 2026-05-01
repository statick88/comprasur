// src/data/config.js
import { Platform } from 'react-native';

// In a real production app, use react-native-dotenv or expo-constants/extra
// For this project, we prioritize flexibility for the developer's environment.

const LOCAL_IP = '192.168.0.106'; // Default from previous dev

export const API_URL = __DEV__ 
  ? `http://${LOCAL_IP}:3000` 
  : 'http://187.124.80.68:3000'; // Production API endpoint

console.log(`[Config] API_URL set to: ${API_URL}`);
