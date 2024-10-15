// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rknrfaylgopbmsntqidn.supabase.co';  // Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrbnJmYXlsZ29wYm1zbnRxaWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUxMDIxNTIsImV4cCI6MjA0MDY3ODE1Mn0.MiZKpZFL34ZsOyBWsJX_lqDdUiuXMRdngor2-GRM1Tk';  // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
