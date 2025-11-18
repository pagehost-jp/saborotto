// グローバル変数：商品情報を保存
let productData = {
  images: [],
  info: null
};

// ステップ間の移動
function showStep0() {
  document.querySelectorAll('.step-section').forEach(section => {
    section.classList.add('hidden');
  });
  document.getElementById('step0').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showStep1() {
  document.querySelectorAll('.step-section').forEach(section => {
    section.classList.add('hidden');
  });
  document.getElementById('step1').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showStep2() {
  document.querySelectorAll('.step-section').forEach(section => {
    section.classList.add('hidden');
  });
  document.getElementById('step2').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// STEP 0: 商品写真アップロード
const productUploadArea = document.getElementById('product-upload-area');
const productUpload = document.getElementById('product-upload');
const productPreview = document.getElementById('product-preview');
const previewImages = document.getElementById('preview-images');
const productInfo = document.getElementById('product-info');
const productDetails = document.getElementById('product-details');

if (productUploadArea && productUpload) {
  productUploadArea.addEventListener('click', () => {
    productUpload.click();
  });

  productUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    productUploadArea.style.borderColor = '#667eea';
    productUploadArea.style.background = '#f5f7ff';
  });

  productUploadArea.addEventListener('dragleave', () => {
    productUploadArea.style.borderColor = '#d0d0d0';
    productUploadArea.style.background = 'white';
  });

  productUploadArea.addEventListener('drop', async (e) => {
    e.preventDefault();
    productUploadArea.style.borderColor = '#d0d0d0';
    productUploadArea.style.background = 'white';

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleProductUpload(files);
    }
  });

  productUpload.addEventListener('change', async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      await handleProductUpload(files);
    }
  });
}

async function handleProductUpload(files) {
  // 画像プレビューを表示
  productPreview.classList.remove('hidden');
  previewImages.innerHTML = '';
  productData.images = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.width = '150px';
      img.style.height = '150px';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '8px';
      img.style.border = '2px solid #e0e0e0';
      img.style.marginRight = '12px';
      img.style.marginBottom = '12px';
      previewImages.appendChild(img);

      productData.images.push(e.target.result);
    };

    reader.readAsDataURL(file);
  }

  // AI解析のシミュレーション
  productInfo.classList.remove('hidden');
  productDetails.innerHTML = '<p style="text-align: center; color: #888;">解析中...</p>';

  await new Promise(resolve => setTimeout(resolve, 2000));

  // シミュレーション結果（実際はAI APIを使用）
  const mockProductInfo = {
    name: 'TOSHIBA 石窯オーブン ER-Y60',
    brand: 'TOSHIBA',
    janCode: '4904550912645',
    model: 'ER-Y60',
    color: 'グランホワイト',
    capacity: '23L',
    wattage: '1000W',
    dimensions: '幅45.0cm × 奥行30.0cm × 高さ40.0cm',
    weight: '12.5kg',
    features: [
      '角皿式スチーム機能搭載',
      '石窯オーブン技術',
      '1段式電子レンジ',
      'コンパクトながら多機能'
    ]
  };

  productData.info = mockProductInfo;

  // 商品情報を表示
  productDetails.innerHTML = `
    <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid #e0e7ff;">
      <div style="margin-bottom: 12px;">
        <strong>商品名：</strong>${mockProductInfo.name}
      </div>
      <div style="margin-bottom: 12px;">
        <strong>ブランド：</strong>${mockProductInfo.brand}
      </div>
      <div style="margin-bottom: 12px;">
        <strong>JANコード：</strong>${mockProductInfo.janCode}
      </div>
      <div style="margin-bottom: 12px;">
        <strong>型番：</strong>${mockProductInfo.model}
      </div>
      <div style="margin-bottom: 12px;">
        <strong>色：</strong>${mockProductInfo.color}
      </div>
      <div style="margin-bottom: 12px;">
        <strong>容量：</strong>${mockProductInfo.capacity}
      </div>
      <div style="margin-bottom: 12px;">
        <strong>消費電力：</strong>${mockProductInfo.wattage}
      </div>
      <div style="margin-bottom: 12px;">
        <strong>寸法：</strong>${mockProductInfo.dimensions}
      </div>
      <div style="margin-bottom: 12px;">
        <strong>重量：</strong>${mockProductInfo.weight}
      </div>
      <div>
        <strong>特徴：</strong>
        <ul style="margin-left: 20px; margin-top: 8px;">
          ${mockProductInfo.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

// STEP 2: スクリーンショットアップロード
const screenshotUploadArea = document.getElementById('screenshot-upload-area');
const screenshotUpload = document.getElementById('screenshot-upload');
const screenshotAdvice = document.getElementById('screenshot-advice');

if (screenshotUploadArea && screenshotUpload) {
  screenshotUploadArea.addEventListener('click', () => {
    screenshotUpload.click();
  });

  screenshotUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    screenshotUploadArea.style.borderColor = '#667eea';
    screenshotUploadArea.style.background = '#f5f7ff';
  });

  screenshotUploadArea.addEventListener('dragleave', () => {
    screenshotUploadArea.style.borderColor = '#d0d0d0';
    screenshotUploadArea.style.background = 'white';
  });

  screenshotUploadArea.addEventListener('drop', async (e) => {
    e.preventDefault();
    screenshotUploadArea.style.borderColor = '#d0d0d0';
    screenshotUploadArea.style.background = 'white';

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleScreenshotUpload(files[0]);
    }
  });

  screenshotUpload.addEventListener('change', async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      await handleScreenshotUpload(files[0]);
    }
  });
}

async function handleScreenshotUpload(file) {
  if (!productData.info) {
    alert('先にSTEP 0で商品情報を登録してください。');
    return;
  }

  if (screenshotAdvice) {
    screenshotAdvice.classList.remove('hidden');
    screenshotAdvice.innerHTML = '<p style="text-align: center;">解析中...</p>';

    // シミュレーション（実際はAI APIを使用）
    await new Promise(resolve => setTimeout(resolve, 1500));

    const product = productData.info;

    // スクリーンショットの内容に応じた回答を生成（シミュレーション）
    screenshotAdvice.innerHTML = `
      <h4 style="color: #667eea; margin-bottom: 16px;">📋 入力アドバイス</h4>

      <div style="background: #f5f7ff; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <strong>この項目には以下の情報を入力してください：</strong>
      </div>

      <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid #e0e7ff; margin-bottom: 16px;">
        <div style="margin-bottom: 16px;">
          <strong style="color: #667eea;">📌 商品名</strong>
          <div style="margin-top: 8px; padding: 12px; background: #f9f9f9; border-radius: 4px;">
            ${product.name}
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <strong style="color: #667eea;">📌 ブランド名</strong>
          <div style="margin-top: 8px; padding: 12px; background: #f9f9f9; border-radius: 4px;">
            ${product.brand}
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <strong style="color: #667eea;">📌 外部製品ID（JANコード）</strong>
          <div style="margin-top: 8px; padding: 12px; background: #f9f9f9; border-radius: 4px;">
            ${product.janCode}
          </div>
          <div style="margin-top: 8px; font-size: 13px; color: #888;">
            💡 「JAN」を選択して、上記の番号を入力してください
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <strong style="color: #667eea;">📌 品番・型番</strong>
          <div style="margin-top: 8px; padding: 12px; background: #f9f9f9; border-radius: 4px;">
            ${product.model}
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <strong style="color: #667eea;">📌 色</strong>
          <div style="margin-top: 8px; padding: 12px; background: #f9f9f9; border-radius: 4px;">
            ${product.color}
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <strong style="color: #667eea;">📌 容量</strong>
          <div style="margin-top: 8px; padding: 12px; background: #f9f9f9; border-radius: 4px;">
            ${product.capacity}
          </div>
          <div style="margin-top: 8px; font-size: 13px; color: #888;">
            💡 単位は「リットル」を選択してください
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <strong style="color: #667eea;">📌 電力消費・ワット数</strong>
          <div style="margin-top: 8px; padding: 12px; background: #f9f9f9; border-radius: 4px;">
            ${product.wattage}
          </div>
          <div style="margin-top: 8px; font-size: 13px; color: #888;">
            💡 単位は「ワット」を選択してください
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <strong style="color: #667eea;">📌 商品の寸法</strong>
          <div style="margin-top: 8px; padding: 12px; background: #f9f9f9; border-radius: 4px;">
            ${product.dimensions}
          </div>
          <div style="margin-top: 8px; font-size: 13px; color: #888;">
            💡 幅・奥行き・高さをそれぞれ「センチメートル」で入力してください
          </div>
        </div>

        <div>
          <strong style="color: #667eea;">📌 商品の重量</strong>
          <div style="margin-top: 8px; padding: 12px; background: #f9f9f9; border-radius: 4px;">
            ${product.weight}
          </div>
          <div style="margin-top: 8px; font-size: 13px; color: #888;">
            💡 単位は「キログラム」を選択してください
          </div>
        </div>
      </div>

      <div style="background: #fff8e1; padding: 16px; border-radius: 8px; border-left: 3px solid #ffc107;">
        <strong>💡 ヒント：</strong><br>
        上記の情報は、STEP 0でアップロードいただいた商品写真から取得したものです。<br>
        セラーセントラルの該当項目に、そのままコピー&ペーストして入力してください。
      </div>

      <div style="margin-top: 16px; padding: 16px; background: #f0f9ff; border-radius: 8px; border-left: 3px solid #0ea5e9;">
        <strong>📸 別の項目がわからない場合：</strong><br>
        再度スクリーンショットをアップロードしてください。同じ商品情報をもとに回答します。
      </div>
    `;
  }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  console.log('サボツール - 初期化完了');
});
