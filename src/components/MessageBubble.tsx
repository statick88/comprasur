import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

type Props = {
  text: string;
  isUser: boolean;
  timestamp: Date | string;
};

export default function MessageBubble({ text, isUser, timestamp }: Props) {
  const timeValue = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const safeTime = Number.isNaN(timeValue.getTime()) ? '--:--' : timeValue.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleOther]}>
      <Text style={[styles.message, isUser ? styles.messageUser : styles.messageOther]}>{text}</Text>
      <Text style={[styles.time, isUser ? styles.timeUser : styles.timeOther]}>
        {safeTime}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '80%',
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.blueDeep,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.cyanSoft,
    borderBottomLeftRadius: 4,
  },
  message: {
    fontSize: theme.fontSizes.md,
    lineHeight: 20,
  },
  messageUser: {
    color: theme.colors.white,
  },
  messageOther: {
    color: theme.colors.blueDeep,
  },
  time: {
    marginTop: 4,
    fontSize: theme.fontSizes.xs,
  },
  timeUser: {
    color: theme.colors.white,
    textAlign: 'right',
    opacity: 0.85,
  },
  timeOther: {
    color: theme.colors.textSecondary,
  },
});
