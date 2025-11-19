// 購入状態管理とStripe Checkout連携

const API_BASE = 'https://saborotto.vercel.app/api';

// ページ読み込み時に購入状態をチェック
window.addEventListener('DOMContentLoaded', async () => {
  await checkPurchaseStatus();
});

// ローカルストレージからユーザーメールを取得
function getUserEmail() {
  return localStorage.getItem('userEmail');
}

// ユーザーメールを保存
function setUserEmail(email) {
  localStorage.setItem('userEmail', email);
}

// 購入状態をチェック
async function checkPurchaseStatus() {
  const userEmail = getUserEmail();

  // URLパラメータで決済成功を確認
  const urlParams = new URLSearchParams(window.location.search);
  const paymentSuccess = urlParams.get('success');

  if (paymentSuccess === 'true') {
    // 決済成功後の処理
    showSuccessMessage();
    // URLをクリーンアップ
    window.history.replaceState({}, document.title, window.location.pathname);
    return;
  }

  // メールアドレスがない場合は購入画面を表示
  if (!userEmail) {
    showPurchaseModal();
    return;
  }

  // メールアドレスがある場合は購入状態を確認
  try {
    const response = await fetch(`${API_BASE}/verify-purchase?email=${encodeURIComponent(userEmail)}`);
    const data = await response.json();

    if (!data.isPurchased) {
      // 未購入の場合は購入画面を表示
      showPurchaseModal();
    } else {
      // 購入済みの場合はツールを表示
      hidePurchaseModal();
    }
  } catch (error) {
    console.error('購入状態の確認に失敗:', error);
    // エラーの場合は購入画面を表示
    showPurchaseModal();
  }
}

// 購入モーダルを表示
function showPurchaseModal() {
  const modal = document.getElementById('purchase-modal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

// 購入モーダルを非表示
function hidePurchaseModal() {
  const modal = document.getElementById('purchase-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Stripe Checkout開始
async function startCheckout() {
  const emailInput = document.getElementById('purchase-email');
  const email = emailInput.value.trim();

  if (!email || !email.includes('@')) {
    alert('有効なメールアドレスを入力してください');
    return;
  }

  // メールアドレスを保存
  setUserEmail(email);

  // ローディング表示
  const button = document.getElementById('checkout-button');
  const originalText = button.textContent;
  button.textContent = '処理中...';
  button.disabled = true;

  try {
    // Checkoutセッションを作成
    const response = await fetch(`${API_BASE}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (data.url) {
      // Stripe Checkoutページに移動
      window.location.href = data.url;
    } else {
      throw new Error('Checkout URLが取得できませんでした');
    }
  } catch (error) {
    console.error('Checkout開始エラー:', error);
    alert('決済画面の起動に失敗しました。もう一度お試しください。');
    button.textContent = originalText;
    button.disabled = false;
  }
}

// 決済成功メッセージを表示
function showSuccessMessage() {
  alert('🎉 購入ありがとうございます！\n\nサボロットをご利用いただけます。');
  hidePurchaseModal();
}
