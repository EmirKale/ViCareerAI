require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function main() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // First find the user
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) {
        console.error("Error listing users:", userError);
        return;
    }
    
    const user = users.users.find(u => u.email === "testsprite@gmail.com");
    if (!user) {
        console.log("User testsprite@gmail.com not found!");
        return;
    }
    
    console.log("Found user ID:", user.id);
    
    // Update profile
    const { data: profile, error: updateError } = await supabase
        .from("profiles")
        .update({ plan: "pro" })
        .eq("id", user.id)
        .select();
        
    if (updateError) {
        console.error("Error updating profile:", updateError);
    } else {
        console.log("Successfully upgraded to PRO:", profile);
    }
}
main();
