module.exports = {
  preset: 'react-native',
  testRegex: '(/__tests__/.*|(\\.|/)(test))\\.(js|jsx|ts|tsx)$',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@react-native-community|expo|@expo|@react-native-async-storage)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/backend/'],
};
