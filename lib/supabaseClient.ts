import { createClient } from "@supabase/supabase-js";

// Define types for env variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Create a strongly typed client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
