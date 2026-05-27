Deno.serve(async (req) => {
  const { phone, otp } = await req.json();
  const authKey = Deno.env.get('MSG91_AUTH_KEY')!;
  const templateId = Deno.env.get('MSG91_TEMPLATE_ID')!;

  // MSG91 expects number without '+' prefix
  const mobile = phone.replace(/^\+/, '');

  const res = await fetch('https://api.msg91.com/api/v5/otp', {
    method: 'POST',
    headers: { authkey: authKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ template_id: templateId, mobile, otp }),
  });

  const body = await res.text();

  if (!res.ok) {
    console.error('MSG91 error:', body);
    return new Response(JSON.stringify({ error: 'SMS send failed' }), { status: 500 });
  }

  return new Response(JSON.stringify({}), { status: 200 });
});
