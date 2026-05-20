import { createClient } from '@supabase/supabase-js';

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
if (supabaseUrl && !supabaseUrl.startsWith('http')) {
  supabaseUrl = `https://${supabaseUrl}`;
}
supabaseUrl = supabaseUrl?.replace(/\/(rest|auth|storage)\/v1\/?$/, '')?.replace(/\/$/, '');

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// Check if credentials are provided
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment/secrets.\n' +
    'The app will continue to load, but Supabase features (Profile Sync) will be unavailable.'
  );
}

// Only initialize if we have the URL and Key to avoid "supabaseUrl is required" error on load
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : (new Proxy({} as any, {
      get: (_, prop) => {
        if (prop === 'storage') {
          return {
            from: () => ({
              upload: () => Promise.resolve({ error: new Error('Supabase not configured') }),
              getPublicUrl: () => ({ data: { publicUrl: '' } }),
            })
          };
        }
        
        // Default behavior for other properties (like .from, .auth) 
        // return a function that returns a dummy object with chainable methods
        return (...args: any[]) => {
          console.error(`Supabase error: Attempted to access "${String(prop)}" but Supabase is not configured.`);
          const chainable = {
            from: () => chainable,
            select: () => chainable,
            eq: () => chainable,
            single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
            upsert: () => Promise.resolve({ error: new Error('Supabase not configured') }),
            upload: () => Promise.resolve({ error: new Error('Supabase not configured') }),
          };
          return chainable;
        };
      }
    }) as any);
