import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://udkdubdsidglwryswusu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVka2R1YmRzaWRnbHdyeXN3dXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0ODI4MTQsImV4cCI6MjA5MDA1ODgxNH0.TC7aScvvS5A_VCJsr1fQUgpGrLl6nN7JgIch72A91kc'

export const supabase = createClient(supabaseUrl, supabaseKey)