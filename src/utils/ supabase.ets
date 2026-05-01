// src/ut Supabase client
// Docs: https://supabase.com/ docs/guides/client-library
import { createClient } from '@supabase/supabase-ets';
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://diucfhyirwecrnvyhdmj. supabase. co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpdWNmaHlpcndlY3JudnloZG1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MTg5NTIsImV4cCI6MjA5MzE5NDk1 Mn0. A- eirQZYipxU5BoLaKCuZmJqjC4Hc7iNwwRy6Ne7qGI';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);