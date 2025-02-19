import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://zyhlrhhgkqzrbbsxsmwl.supabase.co", // Ersetze mit deiner Supabase-URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5aGxyaGhna3F6cmJic3hzbXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4OTQyNzAsImV4cCI6MjA1NTQ3MDI3MH0.-Do9hUyrzgKChxrl-eQq6BVzON_9l6lqoD1sLZC0Ai4" // Ersetze mit deinem Supabase-Anonymen Key
);

export default supabase;
