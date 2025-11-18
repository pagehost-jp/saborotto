// DOM要素の取得
const janCodeInput = document.getElementById('jan-code');
const searchBtn = document.getElementById('search-btn');
const uploadArea = document.getElementById('upload-area');
const imageUpload = document.getElementById('image-upload');
const productInfo = document.getElementById('product-info');
const productDetails = document.getElementById('product-details');
const step2 = document.getElementById('step2');
const sellerUploadArea = document.getElementById('seller-upload-area');
const sellerScreenshot = document.getElementById('seller-screenshot');
const adviceSection = document.getElementById('advice-section');
const adviceContent = document.getElementById('advice-content');

// 商品情報を保存する変数
let currentProduct = null;

// JANコードで検索
searchBtn.addEventListener('click', async () => {
  const janCode = janCodeInput.value.trim();

  if (!janCode || !/^[0-9]{8,13}$/.test(janCode)) {
    alert('正しいJANコードを入力してください（8桁または13桁の数字）');
    return;
  }

  searchBtn.textContent = '検索中...';
  searchBtn.disabled = true;

  // シミュレーション：実際はAPIを叩く
  await simulateAPICall();

  // デモデータを表示
  currentProduct = {
    jan: janCode,
    name: 'サンプル商品名（検索結果）',
    brand: 'サンプルブランド',
    category: '本・雑誌・コミック',
    description: 'これは検索で取得した商品説明のサンプルです。実際にはAPIから取得した情報が表示されます。',
    price: '1,980円'
  };

  displayProductInfo(currentProduct);

  searchBtn.textContent = '商品を検索';
  searchBtn.disabled = false;

  // STEP2を表示
  step2.style.display = 'block';
  step2.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// 画像アップロードエリアのドラッグ&ドロップ
uploadArea.addEventListener('click', () => {
  imageUpload.click();
});

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', async (e) => {
  e.preventDefault();
  uploadArea.classList.remove('drag-over');

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    await handleImageUpload(files);
  }
});

imageUpload.addEventListener('change', async (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    await handleImageUpload(files);
  }
});

// 画像アップロード処理
async function handleImageUpload(files) {
  productInfo.classList.remove('hidden');
  productDetails.innerHTML = '<div class="loading">画像を解析中</div>';

  // シミュレーション：実際はOCRとAI解析
  await simulateAPICall();

  // デモデータを表示
  currentProduct = {
    jan: '4901234567890',
    name: 'サンプル商品名（画像認識）',
    brand: '画像から認識したブランド',
    category: '本・雑誌・コミック',
    description: 'これは画像から認識した商品説明のサンプルです。OCRとAIで自動的に情報を抽出します。',
    features: ['特徴1：高品質', '特徴2：長持ち', '特徴3：使いやすい']
  };

  displayProductInfo(currentProduct);

  // STEP2を表示
  step2.style.display = 'block';
  setTimeout(() => {
    step2.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 300);
}

// 商品情報を表示
function displayProductInfo(product) {
  let html = '';

  if (product.jan) {
    html += `
      <div class="detail-row">
        <span class="detail-label">JANコード:</span>
        <span class="detail-value">${product.jan}</span>
      </div>
    `;
  }

  if (product.name) {
    html += `
      <div class="detail-row">
        <span class="detail-label">商品名:</span>
        <span class="detail-value">${product.name}</span>
      </div>
    `;
  }

  if (product.brand) {
    html += `
      <div class="detail-row">
        <span class="detail-label">ブランド:</span>
        <span class="detail-value">${product.brand}</span>
      </div>
    `;
  }

  if (product.category) {
    html += `
      <div class="detail-row">
        <span class="detail-label">カテゴリ:</span>
        <span class="detail-value">${product.category}</span>
      </div>
    `;
  }

  if (product.description) {
    html += `
      <div class="detail-row">
        <span class="detail-label">商品説明:</span>
        <span class="detail-value">${product.description}</span>
      </div>
    `;
  }

  if (product.features) {
    html += `
      <div class="detail-row">
        <span class="detail-label">商品特徴:</span>
        <span class="detail-value">${product.features.join('<br>')}</span>
      </div>
    `;
  }

  productDetails.innerHTML = html;
  productInfo.classList.remove('hidden');
}

// セラーセントラルのスクリーンショットアップロード
sellerUploadArea.addEventListener('click', () => {
  sellerScreenshot.click();
});

sellerUploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  sellerUploadArea.classList.add('drag-over');
});

sellerUploadArea.addEventListener('dragleave', () => {
  sellerUploadArea.classList.remove('drag-over');
});

sellerUploadArea.addEventListener('drop', async (e) => {
  e.preventDefault();
  sellerUploadArea.classList.remove('drag-over');

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    await handleSellerScreenshot(files[0]);
  }
});

sellerScreenshot.addEventListener('change', async (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    await handleSellerScreenshot(files[0]);
  }
});

// セラーセントラルのスクリーンショット解析
async function handleSellerScreenshot(file) {
  if (!currentProduct) {
    alert('まずSTEP1で商品情報を取得してください');
    return;
  }

  adviceSection.classList.remove('hidden');
  adviceContent.innerHTML = '<div class="loading">スクリーンショットを解析中</div>';

  // シミュレーション：実際はAI解析
  await simulateAPICall();

  // デモのアドバイスを表示
  const advice = generateAdvice(currentProduct);
  adviceContent.innerHTML = advice;

  setTimeout(() => {
    adviceSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 300);
}

// アドバイスを生成（デモ）
function generateAdvice(product) {
  return `
    <h4 style="margin-bottom: 12px; color: #4caf50;">📝 入力アドバイス</h4>

    <p style="margin-bottom: 16px;">
      スクリーンショットを確認しました。以下の情報を入力してください：
    </p>

    <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 12px;">
      <strong>商品名:</strong><br>
      <code style="background: white; padding: 4px 8px; border-radius: 4px; display: inline-block; margin-top: 8px;">
        ${product.name}
      </code>
    </div>

    <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 12px;">
      <strong>ブランド名:</strong><br>
      <code style="background: white; padding: 4px 8px; border-radius: 4px; display: inline-block; margin-top: 8px;">
        ${product.brand}
      </code>
    </div>

    <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 12px;">
      <strong>商品説明:</strong><br>
      <code style="background: white; padding: 8px; border-radius: 4px; display: block; margin-top: 8px; white-space: pre-wrap;">
${product.description}
      </code>
    </div>

    ${product.features ? `
    <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 12px;">
      <strong>商品の特徴（箇条書き）:</strong><br>
      <ul style="margin-top: 8px; margin-left: 20px;">
        ${product.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    <div style="margin-top: 20px; padding: 12px; background: #fff8e1; border-radius: 8px; border-left: 4px solid #ffc107;">
      <strong>💡 ヒント:</strong><br>
      上記の内容をコピーして、セラーセントラルの対応する欄に貼り付けてください。
    </div>
  `;
}

// API呼び出しのシミュレーション
function simulateAPICall() {
  return new Promise(resolve => {
    setTimeout(resolve, 1500);
  });
}

// Enterキーで検索
janCodeInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});
