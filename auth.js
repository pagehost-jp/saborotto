// サボロット - 完全無料版
// 購入チェックは不要。すべてのユーザーが即座にアクセス可能。

// ページ読み込み時に購入モーダルを非表示にする
window.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('purchase-modal');
  if (modal) {
    modal.style.display = 'none';
  }

  // URLパラメータをクリーンアップ（決済関連のパラメータが残っている場合）
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('success') || urlParams.has('canceled') || urlParams.has('session_id')) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});
