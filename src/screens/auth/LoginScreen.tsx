import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, ScrollView } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../store/useUserStore';
import { theme } from '../../theme';
import { InputField, PrimaryButton, SecondaryButton } from '../../components';
import { AppSpec } from '../../../specs/app.spec';
import { UICopy } from '../../../specs/ui-copy';

type AuthMode = 'login' | 'register';

function getAuthTokensFromUrl(url: string) {
  const [, queryOrHash = ''] = url.split(/[?#]/);
  const params = new URLSearchParams(queryOrHash);
  return {
    access_token: params.get('access_token'),
    refresh_token: params.get('refresh_token'),
  };
}

export default function LoginScreen() {
  const setUser = useUserStore((s) => s.setUser);
  const loginAsGuest = useUserStore((s) => s.loginAsGuest);
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const redirectTo = 'comprasur://login-callback';

  const passwordError = useMemo(() => {
    if (mode === 'register' && confirmPassword && password !== confirmPassword) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  }, [confirmPassword, mode, password]);

  const submitDisabled =
    !email.trim() ||
    !password.trim() ||
    (mode === 'register' && (!confirmPassword.trim() || password !== confirmPassword));

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setGoogleLoading(true);
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo, skipBrowserRedirect: true },
      });

      if (oauthError) {
        throw oauthError;
      }

      if (!data?.url) {
        throw new Error('No se recibió URL de autenticación');
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type !== 'success') {
        setError('Inicio de sesión cancelado.');
        return;
      }

      const { access_token, refresh_token } = getAuthTokensFromUrl(result.url);
      if (!access_token || !refresh_token) {
        throw new Error('No se recibieron tokens de autenticación');
      }

      const { error: sessionError } = await supabase.auth.setSession({ access_token, refresh_token });
      if (sessionError) {
        throw sessionError;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw userError || new Error('No se obtuvo el usuario autenticado');
      }

      setUser({
        name: userData.user.user_metadata?.full_name || userData.user.email || 'Usuario',
        email: userData.user.email,
        avatar_url: userData.user.user_metadata?.avatar_url,
        location: 'Quito, Pichincha, Ecuador',
      });
    } catch (e: any) {
      setError(e.message || 'No se pudo iniciar sesión con Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    setError('');
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      setLoading(true);
      const name = email.split('@')[0] || 'Usuario';
      setUser({
        name,
        email: email.trim().toLowerCase(),
        location: 'Quito, Pichincha, Ecuador',
      });
    } catch {
      Alert.alert('Error', 'No se pudo procesar el acceso');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topDecoration} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <Text style={styles.brand}>Comprasur</Text>
          <Text style={styles.subtitle}>Insumos médicos con una experiencia clara, segura y moderna.</Text>
        </View>

        <View style={styles.authCard}>
          <View style={styles.modeSwitch}>
            <Text
              accessibilityRole="button"
              onPress={() => setMode('login')}
              style={[styles.modeText, mode === 'login' && styles.modeTextActive]}>
              Iniciar sesión
            </Text>
            <Text
              accessibilityRole="button"
              onPress={() => setMode('register')}
              style={[styles.modeText, mode === 'register' && styles.modeTextActive]}>
              Registrarme
            </Text>
          </View>

          <InputField
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            placeholder="ejemplo@correo.com"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <InputField
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />
          {mode === 'register' ? (
            <InputField
              label="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              secureTextEntry
              error={passwordError}
            />
          ) : null}

          {!!error ? <Text style={styles.errorBox}>{error}</Text> : null}

          <PrimaryButton
            title={mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
            onPress={handleEmailAuth}
            loading={loading}
            disabled={submitDisabled}
          />
          {AppSpec.auth.googleLogin ? (
            <SecondaryButton
              title="Continuar con Google"
              onPress={handleGoogleLogin}
              loading={googleLoading}
              icon="google"
            />
          ) : null}
          {AppSpec.auth.allowGuest ? (
            <SecondaryButton title={UICopy.guestLogin} onPress={handleGuestLogin} icon="account-outline" />
          ) : null}
          <Text style={styles.bottomLink}>
            {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <Text style={styles.bottomLinkHighlight} onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  topDecoration: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 240,
    backgroundColor: theme.colors.cyanSoft,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
    justifyContent: 'center',
  },
  hero: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  brand: {
    ...theme.typography.h1,
    color: theme.colors.blueDeep,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  authCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  modeSwitch: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  modeText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  modeTextActive: {
    color: theme.colors.blueDeep,
    textDecorationLine: 'underline',
  },
  errorBox: {
    backgroundColor: '#FDECEC',
    borderColor: theme.colors.error,
    borderWidth: 1,
    borderRadius: theme.radius.sm,
    color: theme.colors.error,
    fontSize: theme.fontSizes.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  bottomLink: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
  },
  bottomLinkHighlight: {
    color: theme.colors.blueDeep,
    fontWeight: '700',
  },
});
