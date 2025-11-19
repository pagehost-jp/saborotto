// Stripe Checkoutセッション作成API
const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();

// デバッグログ
console.log('STRIPE_SECRET_KEY check:', {
  isDefined: !!process.env.STRIPE_SECRET_KEY,
  lengthBefore: process.env.STRIPE_SECRET_KEY?.length,
  lengthAfter: stripeKey?.length,
  startsWithCorrectPrefix: stripeKey?.startsWith('sk_test_'),
  first15Chars: stripeKey?.substring(0, 15)
});

const stripe = require('stripe')(stripeKey);

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
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

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

    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout session creation error:', error);
    return res.status(500).json({ error: error.message });
  }
};
