// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jvtgkwhbzblmxxkoyley.supabase.co';  // Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2dGdrd2hiemJsbXh4a295bGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwODM1MDAsImV4cCI6MjAzODY1OTUwMH0.kfjOlZYsGBDsdC6hsQANKYdbNRBtBffFmRH_aokJRGA';  // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
