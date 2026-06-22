const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

(async () => {
    const { data, error } = await supabase.from('usage_quotas').update({ cover_letter_count: 0 }).gt('cover_letter_count', 0);
    console.log(error || "Reset all quotas");
})();
