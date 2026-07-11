// Supabase Configuration
const SUPABASE_URL = 'https://rdijnlypifcikgfxvsfp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3vLlZ-8cIA_b-rDkzWJ7Gg_6O3Aid-Q';

// Initialize Supabase client
const { createClient } = window.supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.supabase = supabaseClient;
