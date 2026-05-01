import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Text,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useChatStore, Message } from '../../store/useChatStore';
import { theme } from '../../theme';
import { AppHeader, EmptyState, MessageBubble } from '../../components';

export default function ChatScreen() {
  const { messages, sendMessage, initRealtime } = useChatStore();
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    return initRealtime();
  }, []);

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setInput('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Chat"
        subtitle="Soporte en línea"
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => (
            <MessageBubble text={item.text} isUser={item.isUser} timestamp={item.timestamp} />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="message-outline"
              title="Sin mensajes aún"
              description="Inicia una conversación para recibir ayuda."
            />
          }
        />

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Escribe un mensaje..."
            placeholderTextColor={theme.colors.textSecondary}
            accessibilityLabel="Escribir mensaje"
            onSubmitEditing={() => handleSend(input)}
            returnKeyType="send"
          />
          <Pressable style={styles.sendBtn} onPress={() => handleSend(input)} accessibilityRole="button">
            <MaterialCommunityIcons name="send" size={20} color={theme.colors.white} />
          </Pressable>
        </View>
        <View style={styles.syncRow}>
          <MaterialCommunityIcons name="sync" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.syncText}>Supabase Realtime activo</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  flex: { flex: 1 },
  list: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xs,
  },
  input: {
    flex: 1,
    minHeight: theme.interaction.minTouchSize,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.md,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.blueDeep,
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  syncText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
  },
});
