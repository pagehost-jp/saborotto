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
      // 同じファイルを再度選択できるようにリセット
      e.target.value = '';
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

    // ファイルを読み込んでプレビュー表示
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target.result;
      screenshotAdvice.innerHTML = `
        <div style="margin-bottom: 20px; text-align: center;">
          <h4 style="color: #667eea; margin-bottom: 12px;">📷 アップロードされたスクリーンショット</h4>
          <img src="${imageData}" style="max-width: 100%; max-height: 300px; border-radius: 8px; border: 2px solid #e0e7ff;">
        </div>
        <p style="text-align: center; color: #888;">
          <span style="display: inline-block; width: 20px; height: 20px; border: 3px solid #667eea; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></span><br>
          文字を読み取っています...
        </p>
        <style>
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
      `;

      try {
        // OCRで文字を読み取る
        const { data: { text } } = await Tesseract.recognize(
          imageData,
          'jpn+eng',
          {
            logger: m => console.log(m)
          }
        );

        console.log('OCR結果:', text);

        // キーワードマッチングで該当項目を検出
        const detectedFields = detectFieldsFromText(text);

        // 検出された項目のアドバイスを生成
        const adviceHTML = generateAdviceForFields(detectedFields, productData.info, imageData);
        screenshotAdvice.innerHTML = adviceHTML;

      } catch (error) {
        console.error('OCRエラー:', error);
        screenshotAdvice.innerHTML = `
          <div style="margin-bottom: 20px; text-align: center;">
            <h4 style="color: #667eea; margin-bottom: 12px;">📷 アップロードされたスクリーンショット</h4>
            <img src="${imageData}" style="max-width: 100%; max-height: 300px; border-radius: 8px; border: 2px solid #e0e7ff;">
          </div>
          <div style="background: #fee; padding: 16px; border-radius: 8px; border-left: 3px solid #f44;">
            <strong>⚠️ エラー：</strong><br>
            文字の読み取りに失敗しました。もう一度試してください。
          </div>
        `;
      }
    };
    reader.readAsDataURL(file);
  }
}

// テキストからキーワードを検出して該当項目を返す
function detectFieldsFromText(text) {
  const normalizedText = text.toLowerCase().replace(/\s+/g, '');
  const detectedFields = [];

  const fieldKeywords = {
    'product-name': ['商品名', 'しょうひんめい', '商品の名称'],
    'brand': ['ブランド名', 'ぶらんど', 'メーカー名', 'めーかー'],
    'jan-code': ['jan', 'janコード', 'バーコード', '外部製品id', '外部製品'],
    'model-number': ['型番', 'かたばん', '品番', 'ひんばん', 'モデル番号'],
    'color': ['色', 'いろ', 'カラー'],
    'capacity': ['容量', 'ようりょう'],
    'wattage': ['ワット', 'わっと', '電力', '消費電力', 'w'],
    'dimensions': ['寸法', 'すんぽう', 'サイズ', '商品の寸法'],
    'weight': ['重量', 'じゅうりょう', '重さ', 'おもさ', '商品の重量'],
    'country-of-origin': ['原産国', 'げんさんこく', '原産地', '地域', '製造国'],
    'warranty': ['保証', 'ほしょう', '保証内容', 'メーカー保証'],
    'hazmat': ['危険物', 'きけんぶつ', '規制', 'バッテリー', '電池'],
    'description': ['商品説明', '説明', 'せつめい'],
    'bullet-points': ['仕様', '箇条書き', '特徴'],
    'manufacturer': ['メーカー', '製造元'],
    'material': ['素材', 'そざい', '材質'],
    'package-dimensions': ['パッケージ', 'ぱっけーじ', '梱包'],
    'sku': ['sku', '在庫管理'],
    'price': ['価格', 'かかく', '在庫'],
    'condition': ['状態', 'じょうたい', '商品の状態']
  };

  for (const [field, keywords] of Object.entries(fieldKeywords)) {
    for (const keyword of keywords) {
      if (normalizedText.includes(keyword.toLowerCase().replace(/\s+/g, ''))) {
        if (!detectedFields.includes(field)) {
          detectedFields.push(field);
        }
        break;
      }
    }
  }

  return detectedFields;
}

// 検出された項目に対するアドバイスを生成
function generateAdviceForFields(fields, product, imageData) {
  if (fields.length === 0) {
    return `
      <div style="margin-bottom: 20px; text-align: center;">
        <h4 style="color: #667eea; margin-bottom: 12px;">📷 アップロードされたスクリーンショット</h4>
        <img src="${imageData}" style="max-width: 100%; max-height: 300px; border-radius: 8px; border: 2px solid #e0e7ff;">
      </div>

      <div style="background: #fff8e1; padding: 16px; border-radius: 8px; border-left: 3px solid #ffc107; margin-bottom: 16px;">
        <strong>💡 項目を検出できませんでした</strong><br>
        スクリーンショットから項目名が読み取れませんでした。<br>
        もう一度、項目名がはっきり写っているスクリーンショットをお試しください。
      </div>

      <button onclick="document.getElementById('screenshot-upload-area').scrollIntoView({ behavior: 'smooth', block: 'center' })" style="margin-top: 20px; width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer;">
        ↑ 別のスクリーンショットを試す
      </button>
    `;
  }

  const fieldAdvice = {
    'product-name': {
      title: '商品名',
      value: product.name,
      hint: '商品の正式名称をそのまま入力してください'
    },
    'brand': {
      title: 'ブランド名',
      value: product.brand,
      hint: 'メーカー名またはブランド名を入力してください'
    },
    'jan-code': {
      title: '外部製品ID（JANコード）',
      value: product.janCode,
      hint: '「JAN」を選択して、上記の番号を入力してください'
    },
    'model-number': {
      title: '品番・型番',
      value: product.model,
      hint: 'パッケージに記載されている型番を入力してください'
    },
    'color': {
      title: '色',
      value: product.color,
      hint: 'パッケージに記載されている色名を入力してください'
    },
    'capacity': {
      title: '容量',
      value: product.capacity,
      hint: '単位は「リットル」を選択してください'
    },
    'wattage': {
      title: '電力消費・ワット数',
      value: product.wattage,
      hint: '単位は「ワット」を選択してください'
    },
    'dimensions': {
      title: '商品の寸法',
      value: product.dimensions,
      hint: '幅・奥行き・高さをそれぞれ「センチメートル」で入力してください'
    },
    'weight': {
      title: '商品の重量',
      value: product.weight,
      hint: '単位は「キログラム」を選択してください'
    },
    'country-of-origin': {
      title: '原産国/地域',
      value: '日本',
      hint: 'パッケージに「Made in 〇〇」と記載されています'
    },
    'warranty': {
      title: '保証内容',
      value: '2年間のメーカー保証',
      hint: 'パッケージや取扱説明書に保証について記載されています'
    },
    'hazmat': {
      title: '危険物規制の種類',
      value: '該当なし',
      hint: 'リチウム電池を含む場合は「危険物ラベル(GHS)」を選択してください。それ以外は「該当なし」を選択してください。'
    },
    'description': {
      title: '商品説明',
      value: product.features.join('、'),
      hint: 'パッケージの裏面や側面に書かれている説明文を参考にしてください'
    },
    'manufacturer': {
      title: 'メーカー名',
      value: product.brand,
      hint: '製造メーカーを入力してください'
    }
  };

  let html = `
    <div style="margin-bottom: 20px; text-align: center;">
      <h4 style="color: #667eea; margin-bottom: 12px;">📷 アップロードされたスクリーンショット</h4>
      <img src="${imageData}" style="max-width: 100%; max-height: 300px; border-radius: 8px; border: 2px solid #e0e7ff;">
    </div>

    <h4 style="color: #667eea; margin-bottom: 16px;">📋 検出された項目の入力アドバイス</h4>

    <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; margin-bottom: 16px; border-left: 3px solid #0ea5e9;">
      <strong>✅ ${fields.length}個の項目を検出しました</strong>
    </div>

    <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid #e0e7ff; margin-bottom: 16px;">
  `;

  fields.forEach((field, index) => {
    const advice = fieldAdvice[field];
    if (advice) {
      html += `
        <div style="${index > 0 ? 'margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;' : ''}">
          <strong style="color: #667eea;">📌 ${advice.title}</strong>
          <div style="margin-top: 8px; padding: 12px; background: #f9f9f9; border-radius: 4px; font-family: monospace;">
            ${advice.value}
          </div>
          <div style="margin-top: 8px; font-size: 13px; color: #888;">
            💡 ${advice.hint}
          </div>
        </div>
      `;
    }
  });

  html += `
    </div>

    <div style="background: #fff8e1; padding: 16px; border-radius: 8px; border-left: 3px solid #ffc107;">
      <strong>💡 ヒント：</strong><br>
      上記の情報は、STEP 0でアップロードいただいた商品写真から取得したものです。<br>
      セラーセントラルの該当項目に、そのままコピー&ペーストして入力してください。
    </div>

    <button onclick="document.getElementById('screenshot-upload-area').scrollIntoView({ behavior: 'smooth', block: 'center' })" style="margin-top: 20px; width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer;">
      ↑ 別の項目を質問する
    </button>
  `;

  return html;
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  console.log('サボツール - 初期化完了');
});
