// Stripe Checkoutセッション作成API
module.exports = async (req, res) => {
  // CORSヘッダー設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONSリクエスト（プリフライト）への対応
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 環境変数の存在確認（デバッグログ）
    const rawKey = process.env.STRIPE_SECRET_KEY || '';
    const stripeKey = rawKey.trim().replace(/^["']|["']$/g, '');

    console.log('=== Environment Variable Debug ===');
    console.log('[DEBUG] All env vars keys:', Object.keys(process.env).filter(k => k.includes('STRIPE')));
    console.log('[DEBUG] process.env.STRIPE_SECRET_KEY type:', typeof process.env.STRIPE_SECRET_KEY);
    console.log('[DEBUG] process.env.STRIPE_SECRET_KEY exists?', !!process.env.STRIPE_SECRET_KEY);
    console.log('[DEBUG] process.env.STRIPE_SECRET_KEY === undefined?', process.env.STRIPE_SECRET_KEY === undefined);
    console.log('[DEBUG] process.env.STRIPE_SECRET_KEY === ""?', process.env.STRIPE_SECRET_KEY === '');
    console.log('[DEBUG] Raw key length:', rawKey.length);
    console.log('[DEBUG] Trimmed key length:', stripeKey.length);
    console.log('[DEBUG] Starts with sk_test_?', stripeKey.startsWith('sk_test_'));
    console.log('[DEBUG] Starts with sk_live_?', stripeKey.startsWith('sk_live_'));
    console.log('[DEBUG] First 7 chars:', stripeKey.substring(0, 7));
    console.log('[DEBUG] Last 10 chars:', stripeKey.substring(stripeKey.length - 10));
    console.log('==================================');

    // 環境変数が存在しない場合は明確なエラーを返す
    if (!stripeKey || stripeKey.length < 20) {
      console.error('❌ STRIPE_SECRET_KEY is missing or invalid');
      return res.status(500).json({
        error: 'Server configuration error: STRIPE_SECRET_KEY is not properly set',
        details: 'Please check Vercel environment variables'
      });
    }

    // Stripeクライアントを初期化（関数内で初期化することで環境変数の問題を明確化）
    const stripe = require('stripe')(stripeKey);

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log('Creating checkout session for:', email);

    // Stripe Checkoutセッションを作成
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: 'サボロット - 買い切りライセンス',
              description: 'せどり向けAmazonカタログ作成支援ツール。買い切り型で追加料金なし。30日間返金保証付き。',
            },
            unit_amount: 1980, // ¥1,980
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // 買い切り決済
      success_url: `${process.env.NEXT_PUBLIC_URL || 'https://saborotto.vercel.app'}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'https://saborotto.vercel.app'}/?canceled=true`,
      metadata: {
        user_email: email,
      },
    });

    console.log('✅ Checkout session created:', session.id);
    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('❌ Checkout session creation error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      error: error.message || 'Failed to create checkout session',
      type: error.type || 'unknown_error'
    });
  }
};
