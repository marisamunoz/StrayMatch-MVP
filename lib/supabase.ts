import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://myhxolmlmgoamxvpovnv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15aHhvbG1sbWdvYW14dnBvdm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MTI4MTcsImV4cCI6MjA3OTA4ODgxN30.jhHyiFae15kGr2wk_wwd2VFRgQz0OolSPIb--tKXO_0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});