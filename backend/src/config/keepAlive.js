import { supabase } from './supabase.js';

const INTERVAL_MS = 9 * 60 * 1000;

export function startKeepAlive() {
  const hit = async () => {
    try {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      console.log(`[KeepAlive] Users: ${count} | ${new Date().toLocaleTimeString()}`);
    } catch (err) {
      console.error('[KeepAlive] Error:', err.message);
    }
  };

  hit();
  setInterval(hit, INTERVAL_MS);
  console.log(`[KeepAlive] Started — every ${INTERVAL_MS / 1000}s`);
}
