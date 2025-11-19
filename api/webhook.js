// Stripe Webhookハンドラー - 決済完了時の処理
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY?.trim());
const admin = require('firebase-admin');

// Firebase Admin初期化（複数回初期化を防ぐ）
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID?.trim(),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL?.trim(),
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.trim().replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Stripeからのリクエストを検証
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // checkout.session.completed イベントを処理
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerEmail = session.customer_email || session.metadata.user_email;

    if (!customerEmail) {
      console.error('No customer email found in session');
      return res.status(400).json({ error: 'No customer email' });
    }

    try {
      // Firestoreにユーザーの購入情報を保存
      await db.collection('purchases').doc(customerEmail).set({
        email: customerEmail,
        purchaseDate: admin.firestore.FieldValue.serverTimestamp(),
        sessionId: session.id,
        paymentStatus: session.payment_status,
        amountTotal: session.amount_total,
        currency: session.currency,
        isPaid: true,
      });

      console.log(`Purchase recorded for ${customerEmail}`);
    } catch (error) {
      console.error('Error saving purchase to Firestore:', error);
      return res.status(500).json({ error: 'Failed to save purchase' });
    }
  }

  // Webhookを受信したことをStripeに通知
  res.status(200).json({ received: true });
};
