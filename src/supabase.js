import { createClient } from "@supabase/supabase-js";

// Deine Supabase URL und der Anonyme Key (aus der Supabase-Konsole)
const supabaseUrl = "https://zyhlrhhgkqzrbbsxsmwl.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5aGxyaGhna3F6cmJic3hzbXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4OTQyNzAsImV4cCI6MjA1NTQ3MDI3MH0.-Do9hUyrzgKChxrl-eQq6BVzON_9l6lqoD1sLZC0Ai4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
