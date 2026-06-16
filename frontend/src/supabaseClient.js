// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wvleapisjjfnnzdgjpqm.supabase.co';
const supabaseAnonKey = 'sb_publishable_G48Uf0N0tX-aiqKcR6dRnA_EJwtVzQW';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);