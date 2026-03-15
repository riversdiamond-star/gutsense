import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xhmcofdgmmhimaprwskh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhobWNvZmRnbW1oaW1hcHJ3c2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MTQ1MjQsImV4cCI6MjA4ODQ5MDUyNH0._Yi4pbo63aCMVu8YMZHhwxVvBseYyjXguTS8ro7wojs'

export const supabase = createClient(supabaseUrl, supabaseKey)