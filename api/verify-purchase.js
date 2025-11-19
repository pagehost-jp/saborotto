// 購入状態確認API
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
  // CORSヘッダー設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONSリクエスト（プリフライト）への対応
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const email = req.method === 'GET' ? req.query.email : req.body.email;

    console.log('=== Verify Purchase Request ===');
    console.log('Email:', email);
    console.log('Method:', req.method);

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Firestoreから購入情報を取得
    const purchaseDoc = await db.collection('purchases').doc(email).get();

    if (!purchaseDoc.exists) {
      console.log('No purchase found for:', email);
      return res.status(200).json({
        isPurchased: false,
        message: 'No purchase found for this email'
      });
    }

    const purchaseData = purchaseDoc.data();
    console.log('✅ Purchase found:', { email, isPaid: purchaseData.isPaid });

    return res.status(200).json({
      isPurchased: purchaseData.isPaid || false,
      purchaseDate: purchaseData.purchaseDate?.toDate() || null,
      email: purchaseData.email,
    });
  } catch (error) {
    console.error('❌ Error verifying purchase:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      error: error.message || 'Failed to verify purchase',
      details: 'Internal server error'
    });
  }
};
