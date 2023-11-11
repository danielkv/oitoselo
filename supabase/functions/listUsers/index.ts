import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

Deno.serve(async (req) => {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

    const client = createClient(supabaseUrl, serviceKey)

    const url = new URL(req.url)
    const page = Number(url.searchParams.get('page')) || 0
    const limit = Number(url.searchParams.get('limit')) || 10

    const from = page * limit
    const to = from + limit

    const { data, error } = await client.from('users').select('*').range(from, to)
    if (error) return new Response(error.message)

    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
})

// To invoke:
// curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
