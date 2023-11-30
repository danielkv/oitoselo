// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

Deno.serve(async (req: Request) => {
    try {
        if (req.method === 'OPTIONS') {
            return new Response('ok', { headers: corsHeaders })
        }

        if (req.method !== 'POST') return new Response('Invalid method', { status: 405, headers: corsHeaders })

        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
        const serviceKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

        const client = createClient(supabaseUrl, serviceKey, {
            global: { headers: { Authorization: req.headers.get('Authorization')! } },
        })

        const {
            data: { user },
        } = await client.auth.getUser()
        if (user?.app_metadata.claims_admin !== true)
            return new Response('User is not an admin', { status: 401, headers: corsHeaders })

        const { userId } = await req.json()
        if (!userId) return new Response('User ID not found', { status: 422, headers: corsHeaders })

        await client.rpc('set_claim', { uid: userId, claim: 'userrole', value: 'default' })

        return new Response('ok', { headers: { ...corsHeaders, 'Content-Type': 'text/html' } })
    } catch (err) {
        return new Response(err.message, { status: 500, headers: corsHeaders })
    }
})

// To invoke:
// curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
