// src/utils/supabase.ts
// Cliente Supabase para auth + base de datos
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "https://diucfhyirwecrnvyhdmj.supabase.co";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
