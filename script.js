// グローバル変数：商品情報を保存
let productData = {
  images: [],
  info: null
};

// API Keys
const RAKUTEN_APP_ID = '1033125456585026326';
const YAHOO_APP_ID = '1015356078042672319';

// Gemini APIキーのみlocalStorageから取得
function getAPIKey(keyName) {
  return localStorage.getItem(keyName) || '';
}

const GEMINI_API_KEY = () => getAPIKey('gemini_api_key');

// 設定画面の表示/非表示
function showSettings() {
  // 現在の設定を読み込み
  document.getElementById('gemini-api-key').value = getAPIKey('gemini_api_key');

  document.getElementById('settings-modal').style.display = 'block';
}

function closeSettings() {
  document.getElementById('settings-modal').style.display = 'none';
}

function saveSettings() {
  const geminiKey = document.getElementById('gemini-api-key').value.trim();

  // 必須チェック（Geminiのみ）
  if (!geminiKey) {
    alert('Gemini API キーは必須です。');
    return;
  }

  // 保存
  localStorage.setItem('gemini_api_key', geminiKey);

  alert('✅ 設定を保存しました！');
  closeSettings();
}

// 初回起動チェック
function checkAPIKeys() {
  if (!getAPIKey('gemini_api_key')) {
    // 初回起動または未設定
    setTimeout(() => {
      if (confirm('サボロットを使うには、Gemini APIキーの設定が必要です。\n（無料・30秒で取得可能・追加料金なし）\n\n設定画面を開きますか？')) {
        showSettings();
      }
    }, 1000);
  }
}

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

// 商品写真をリセット
function resetProductUpload() {
  if (confirm('アップロードした写真と商品情報を削除してやり直しますか？')) {
    // データをクリア
    productData.images = [];
    productData.info = null;

    // プレビューと商品情報を非表示
    document.getElementById('product-preview').classList.add('hidden');
    document.getElementById('product-info').classList.add('hidden');

    // プレビュー画像をクリア
    document.getElementById('preview-images').innerHTML = '';
    document.getElementById('product-details').innerHTML = '';

    // ファイル入力をリセット
    document.getElementById('product-upload').value = '';

    // アップロードエリアにスクロール
    document.getElementById('product-upload-area').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// 商品情報をリセット（JAN検索用）
function resetProductInfo() {
  productData.info = null;
  document.getElementById('product-info').classList.add('hidden');
  document.getElementById('jan-not-found').classList.add('hidden');
  document.getElementById('jan-input').value = '';
  document.getElementById('jan-input').focus();
}

// JAN入力ステータス更新
function updateJANStatus(value) {
  const janStatus = document.getElementById('jan-status');

  if (!value) {
    janStatus.textContent = '';
    return;
  }

  if (!/^\d+$/.test(value)) {
    janStatus.innerHTML = '⚠️ 数字のみ入力してください';
    janStatus.style.color = '#f44';
    return;
  }

  if (value.length === 8 || value.length === 13) {
    janStatus.innerHTML = '✅ 入力完了（検索ボタンを押してください）';
    janStatus.style.color = '#4caf50';
  } else {
    janStatus.innerHTML = `あと${(value.length < 8 ? 8 : 13) - value.length}桁入力してください`;
    janStatus.style.color = '#888';
  }
}

// JANコードで商品検索
async function searchByJAN() {
  const janInput = document.getElementById('jan-input');
  const janCode = janInput.value.trim();
  const janStatus = document.getElementById('jan-status');

  if (!janCode) {
    alert('JANコードを入力してください');
    return;
  }

  if (!/^\d{8}$|^\d{13}$/.test(janCode)) {
    janStatus.innerHTML = '⚠️ JANコードは8桁または13桁の数字で入力してください';
    janStatus.style.color = '#f44';
    return;
  }

  janStatus.innerHTML = '🔍 検索中...';
  janStatus.style.color = '#667eea';

  // ローディング表示
  const productInfo = document.getElementById('product-info');
  const productDetails = document.getElementById('product-details');
  productInfo.classList.remove('hidden');
  productDetails.innerHTML = `
    <p style="text-align: center; color: #888;">
      <span style="display: inline-block; width: 20px; height: 20px; border: 3px solid #667eea; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></span><br>
      商品情報を検索中...
    </p>
    <style>
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  `;

  try {
    // まず楽天APIで検索
    let productInfo = await searchRakuten(janCode);

    // 楽天で見つからなければYahoo!で検索
    if (!productInfo) {
      productInfo = await searchYahoo(janCode);
    }

    if (productInfo) {
      // 商品情報を保存
      productData.info = productInfo;

      // デバッグ：取得した商品情報をログ出力
      console.log('取得した商品情報:', productInfo);

      // 商品情報を表示
      displayProductInfo(productInfo);

      // エラーメッセージを非表示
      document.getElementById('jan-not-found').classList.add('hidden');
    } else {
      // 見つからなかった場合
      document.getElementById('product-info').classList.add('hidden');
      document.getElementById('jan-not-found').classList.remove('hidden');
    }

  } catch (error) {
    console.error('検索エラー:', error);
    alert('商品情報の取得中にエラーが発生しました。もう一度お試しください。');
    document.getElementById('product-info').classList.add('hidden');
  }
}

// 楽天APIで検索
async function searchRakuten(janCode) {
  try {
    const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?format=json&applicationId=${RAKUTEN_APP_ID}&keyword=${janCode}&hits=1`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.Items && data.Items.length > 0) {
      const item = data.Items[0].Item;
      const itemName = item.itemName || '';

      return {
        name: itemName,
        brand: extractBrandFromName(itemName),
        janCode: janCode,
        model: '',
        weight: '',
        dimensions: '',
        capacity: '',
        wattage: '',
        color: '',
        price: item.itemPrice ? `¥${item.itemPrice.toLocaleString()}` : '',
        features: [item.itemCaption || ''].filter(f => f)
      };
    }
    return null;
  } catch (error) {
    console.error('楽天API エラー:', error);
    return null;
  }
}

// Yahoo!ショッピングAPIで検索
async function searchYahoo(janCode) {
  try {
    const url = `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=${YAHOO_APP_ID}&jan_code=${janCode}&results=1`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.hits && data.hits.length > 0) {
      const item = data.hits[0];
      const itemName = item.name || '';

      return {
        name: itemName,
        brand: extractBrandFromName(itemName),
        janCode: janCode,
        model: '',
        weight: '',
        dimensions: '',
        capacity: '',
        wattage: '',
        color: '',
        price: item.price ? `¥${parseInt(item.price).toLocaleString()}` : '',
        features: [item.description || ''].filter(f => f)
      };
    }
    return null;
  } catch (error) {
    console.error('Yahoo! API エラー:', error);
    return null;
  }
}

// 商品名からブランド/メーカー名を抽出
function extractBrandFromName(name) {
  if (!name) return '';

  // よくあるメーカー名のパターン
  const brandPatterns = [
    // 英語ブランド（最初の単語）
    /^([A-Z][a-z]+|[A-Z]+)\s/,
    // 日本語ブランド（カタカナ）
    /^([ァ-ヴー]+)\s/,
    // 括弧内のブランド
    /【([^】]+)】/,
    /\[([^\]]+)\]/,
    /（([^）]+)）/,
    /\(([^)]+)\)/
  ];

  for (const pattern of brandPatterns) {
    const match = name.match(pattern);
    if (match) {
      const brand = match[1].trim();
      // 明らかにブランドでない単語を除外
      if (brand.length > 1 &&
          !brand.includes('新品') &&
          !brand.includes('中古') &&
          !brand.includes('送料') &&
          brand.length < 20) {
        return brand;
      }
    }
  }

  // デフォルト：最初の単語を返す
  const firstWord = name.split(/[\s　]/)[0];
  if (firstWord && firstWord.length > 1 && firstWord.length < 20) {
    return firstWord;
  }

  return '';
}

// 商品情報を表示（JAN検索用）
function displayProductInfo(info) {
  const productDetails = document.getElementById('product-details');
  productDetails.innerHTML = `
    <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid #e0e7ff;">
      <div style="margin-bottom: 12px;">
        <strong>商品名：</strong>${info.name || '（取得できませんでした）'}
      </div>
      ${info.brand ? `<div style="margin-bottom: 12px;"><strong>ブランド/ショップ：</strong>${info.brand}</div>` : ''}
      ${info.janCode ? `<div style="margin-bottom: 12px;"><strong>JANコード：</strong>${info.janCode}</div>` : ''}
      ${info.price ? `<div style="margin-bottom: 12px;"><strong>参考価格：</strong>${info.price}</div>` : ''}
      ${info.features && info.features.length > 0 ? `
        <div>
          <strong>説明：</strong>
          <div style="margin-top: 8px; padding: 12px; background: #f9f9f9; border-radius: 4px; font-size: 14px;">
            ${info.features[0].substring(0, 200)}${info.features[0].length > 200 ? '...' : ''}
          </div>
        </div>
      ` : ''}
    </div>
    <div style="margin-top: 16px; padding: 16px; background: #f0f9ff; border-radius: 8px; border-left: 3px solid #0ea5e9;">
      <strong>✅ 商品情報を取得しました</strong><br>
      この情報をもとに、STEP 2でわからない項目についてアドバイスします。
    </div>
  `;
}

// 商品情報を表示（画像解析用）
function displayProductInfoForImage(info) {
  productAnalysisDetails.innerHTML = `
    <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid #e0e7ff;">
      <div style="margin-bottom: 12px;">
        <strong>商品名：</strong>${info.name || '（取得できませんでした）'}
      </div>
      ${info.brand ? `<div style="margin-bottom: 12px;"><strong>ブランド：</strong>${info.brand}</div>` : ''}
      ${info.model ? `<div style="margin-bottom: 12px;"><strong>型番：</strong>${info.model}</div>` : ''}
      ${info.weight ? `<div style="margin-bottom: 12px;"><strong>重量：</strong>${info.weight}</div>` : ''}
      ${info.dimensions ? `<div style="margin-bottom: 12px;"><strong>寸法：</strong>${info.dimensions}</div>` : ''}
      ${info.color ? `<div style="margin-bottom: 12px;"><strong>色：</strong>${info.color}</div>` : ''}
      ${info.features && info.features.length > 0 ? `
        <div>
          <strong>特徴：</strong>
          <div style="margin-top: 8px; padding: 12px; background: #f9f9f9; border-radius: 4px; font-size: 14px;">
            ${info.features.join('、')}
          </div>
        </div>
      ` : ''}
    </div>
    <div style="margin-top: 16px; padding: 16px; background: #f0f9ff; border-radius: 8px; border-left: 3px solid #0ea5e9;">
      <strong>✅ 商品情報を解析しました</strong><br>
      この情報をもとに、STEP 2でわからない項目についてアドバイスします。
    </div>
  `;
}

// STEP 0: 商品写真アップロード
const productUploadArea = document.getElementById('product-upload-area');
const productUpload = document.getElementById('product-upload');
const productPreview = document.getElementById('product-preview');
const previewImages = document.getElementById('preview-images');
const productAnalysis = document.getElementById('product-analysis');
const productAnalysisDetails = document.getElementById('product-analysis-details');

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

  // 既存の画像数を確認
  const currentImageCount = productData.images.length;
  const remainingSlots = 3 - currentImageCount;

  if (remainingSlots <= 0) {
    alert('画像は最大3枚までです。削除してから追加してください。');
    return;
  }

  // 追加できる枚数
  const imagesToAdd = Math.min(files.length, remainingSlots);

  for (let i = 0; i < imagesToAdd; i++) {
    const file = files[i];
    const reader = new FileReader();

    await new Promise((resolve) => {
      reader.onload = (e) => {
        const imageData = e.target.result;

        // プレビュー画像を作成
        const imgContainer = document.createElement('div');
        imgContainer.style.position = 'relative';
        imgContainer.style.display = 'inline-block';

        const img = document.createElement('img');
        img.src = imageData;
        img.style.width = '150px';
        img.style.height = '150px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '8px';
        img.style.border = '2px solid #e0e0e0';
        img.style.marginRight = '12px';
        img.style.marginBottom = '12px';

        // 削除ボタンを追加
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '×';
        deleteBtn.style.position = 'absolute';
        deleteBtn.style.top = '5px';
        deleteBtn.style.right = '17px';
        deleteBtn.style.width = '25px';
        deleteBtn.style.height = '25px';
        deleteBtn.style.borderRadius = '50%';
        deleteBtn.style.background = '#f44';
        deleteBtn.style.color = 'white';
        deleteBtn.style.border = 'none';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.fontSize = '18px';
        deleteBtn.style.fontWeight = 'bold';
        deleteBtn.style.lineHeight = '1';
        deleteBtn.onclick = () => {
          const index = productData.images.indexOf(imageData);
          if (index > -1) {
            productData.images.splice(index, 1);
            imgContainer.remove();
            if (productData.images.length === 0) {
              productPreview.classList.add('hidden');
              productAnalysis.classList.add('hidden');
            }
          }
        };

        imgContainer.appendChild(img);
        imgContainer.appendChild(deleteBtn);
        previewImages.appendChild(imgContainer);

        productData.images.push(imageData);
        resolve();
      };
      reader.readAsDataURL(file);
    });
  }

  if (imagesToAdd < files.length) {
    alert(`画像は最大3枚までです。${imagesToAdd}枚を追加しました。`);
  }

  // 自動解析開始
  autoAnalyzeProductImages();
}

// 自動解析開始
function autoAnalyzeProductImages() {
  productAnalysis.classList.remove('hidden');
  productAnalysisDetails.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <p style="margin-bottom: 16px; color: #555;">
        <strong>${productData.images.length}枚の画像</strong>がアップロードされました。<br>
        ${productData.images.length < 3 ? '<span style="color: #888; font-size: 14px;">（さらに追加して再解析できます）</span>' : ''}
      </p>
      <p style="color: #667eea; font-weight: 600;">🤖 AIで解析中...</p>
    </div>
  `;

  // 少し待ってから解析開始（ユーザーにフィードバック）
  setTimeout(() => {
    analyzeProductImages();
  }, 800);
}

// 商品画像を解析
async function analyzeProductImages() {
  productAnalysisDetails.innerHTML = `
    <p style="text-align: center; color: #888;">
      <span style="display: inline-block; width: 20px; height: 20px; border: 3px solid #667eea; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></span><br>
      AIが商品情報を解析しています...
    </p>
    <style>
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  `;

  try {
    // Gemini APIで商品写真を解析
    const extractedInfo = await analyzeProductImagesWithGemini(productData.images);

    // JANコードも抽出できていればJANコードプロパティを追加
    if (!extractedInfo.janCode) {
      extractedInfo.janCode = '';
    }

    productData.info = extractedInfo;

    console.log('抽出された商品情報:', extractedInfo);

    // 商品情報を表示（画像解析用）
    displayProductInfoForImage(extractedInfo);

  } catch (error) {
    console.error('商品情報読み取りエラー:', error);
    productAnalysisDetails.innerHTML = `
      <div style="background: #fee; padding: 16px; border-radius: 8px; border-left: 3px solid #f44;">
        <strong>⚠️ エラー：</strong><br>
        商品情報の読み取りに失敗しました。もう一度試してください。<br>
        <small style="color: #999;">${error.message}</small>
      </div>
      <button onclick="analyzeProductImages()" style="margin-top: 20px; padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">
        🔄 もう一度解析する
      </button>
    `;
  }
}

// テキストから商品情報を抽出
function extractProductInfo(text) {
  // テキストを整形（余分なスペースを削除）
  const cleanedText = text.replace(/\s+/g, ' ').trim();

  const info = {
    name: '',
    brand: '',
    janCode: '',
    model: '',
    weight: '',
    dimensions: '',
    capacity: '',
    wattage: '',
    color: '',
    features: []
  };

  // JANコード（13桁または8桁）
  const janMatch = cleanedText.match(/\b(49\d{11}|\d{13}|\d{8})\b/);
  if (janMatch) {
    info.janCode = janMatch[1];
  }

  // 重量（kg、g）- より柔軟なパターンマッチング
  const weightMatch = cleanedText.match(/(\d+\.?\d*)\s*k\s*g|(\d+\.?\d*)\s*キログラム|(\d+\.?\d*)\s*g\s*(?!x)|(\d+\.?\d*)\s*グラム/i);
  if (weightMatch) {
    const value = weightMatch[1] || weightMatch[2] || weightMatch[3] || weightMatch[4];
    if (cleanedText.toLowerCase().includes('kg') || cleanedText.includes('キログラム')) {
      info.weight = value + 'kg';
    } else {
      info.weight = value + 'g';
    }
  }

  // 寸法（cm、mm）
  const dimensionMatch = cleanedText.match(/(\d+\.?\d*)\s*[x×]\s*(\d+\.?\d*)\s*[x×]\s*(\d+\.?\d*)\s*c\s*m|(\d+\.?\d*)\s*[x×]\s*(\d+\.?\d*)\s*[x×]\s*(\d+\.?\d*)\s*センチ/i);
  if (dimensionMatch) {
    if (dimensionMatch[1]) {
      info.dimensions = `${dimensionMatch[1]} × ${dimensionMatch[2]} × ${dimensionMatch[3]}cm`;
    } else {
      info.dimensions = `${dimensionMatch[4]} × ${dimensionMatch[5]} × ${dimensionMatch[6]}cm`;
    }
  }

  // 容量（L、ml）
  const capacityMatch = cleanedText.match(/(\d+\.?\d*)\s*l\s*(?!x)|(\d+\.?\d*)\s*リットル|(\d+\.?\d*)\s*m\s*l|(\d+\.?\d*)\s*ミリリットル/i);
  if (capacityMatch) {
    const value = capacityMatch[1] || capacityMatch[2] || capacityMatch[3] || capacityMatch[4];
    if (cleanedText.toLowerCase().includes('ml') || cleanedText.includes('ミリリットル')) {
      info.capacity = value + 'ml';
    } else {
      info.capacity = value + 'L';
    }
  }

  // ワット数
  const wattageMatch = cleanedText.match(/(\d+)\s*w\s*(?!x)|(\d+)\s*ワット/i);
  if (wattageMatch) {
    info.wattage = (wattageMatch[1] || wattageMatch[2]) + 'W';
  }

  // 商品名を抽出（ノイズを除外）
  const lines = text.split('\n')
    .map(line => line.trim())
    .filter(line => {
      // ノイズを除外（URL、UI要素など）
      return line.length > 5 &&
             line.length < 200 &&
             !line.includes('http') &&
             !line.includes('amazon.co') &&
             !line.includes('Google') &&
             !line.includes('ブックマーク') &&
             !line.includes('編集') &&
             !line.includes('表示');
    });

  if (lines.length > 0) {
    // 商品名らしい行を探す（ナッツ、オーブン、などの商品関連キーワードを含む）
    const productLine = lines.find(line =>
      line.includes('ナッツ') ||
      line.includes('オーブン') ||
      line.includes('ミックス') ||
      line.includes('アーモンド') ||
      line.includes('くるみ') ||
      line.includes('カシュー')
    );

    if (productLine) {
      // スペースを削除して整形
      info.name = productLine.replace(/\s+/g, '').substring(0, 100);
    } else {
      // 最も長い行を商品名とする
      const longestLine = lines.reduce((a, b) => a.length > b.length ? a : b);
      info.name = longestLine.replace(/\s+/g, '').substring(0, 100);
    }
  }

  // その他の情報を特徴として保存（ノイズを除外）
  info.features = lines
    .slice(0, 10)
    .filter(line => line.length > 10 && line.length < 150)
    .map(line => line.replace(/\s+/g, '').substring(0, 80))
    .slice(0, 5);

  return info;
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
    alert('先にSTEP 1でJANコードを入力して商品情報を登録してください。');
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
          AIが画像を解析しています...
        </p>
        <style>
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
      `;

      try {
        // Gemini APIで画像を解析
        const aiResponse = await analyzeScreenshotWithGemini(imageData, productData.info);

        // AIの回答をフォーマット処理
        let highlightedResponse = aiResponse
          // カテゴリー見出しを装飾
          .replace(/## (.*)/g, '<div style="margin-top: 24px; margin-bottom: 12px; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; font-weight: 700; font-size: 16px;">$1</div>')
          // 太字を装飾
          .replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #667eea;">$1</strong>')
          // 強調キーワード
          .replace(/(メーカーサイト[^。\n]*確認[^。\n]*)/g, '<span style="background: #fff3cd; padding: 2px 6px; border-radius: 4px; color: #856404; font-weight: 600;">⚠️ $1</span>')
          .replace(/(実測[^。\n]*)/g, '<span style="background: #fff3cd; padding: 2px 6px; border-radius: 4px; color: #856404; font-weight: 600;">📏 $1</span>')
          .replace(/(パッケージ[^。\n]*確認[^。\n]*)/g, '<span style="background: #d1ecf1; padding: 2px 6px; border-radius: 4px; color: #0c5460; font-weight: 600;">📦 $1</span>');

        // AIの回答を表示
        screenshotAdvice.innerHTML = `
          <div style="margin-bottom: 20px; text-align: center;">
            <h4 style="color: #667eea; margin-bottom: 12px;">📷 アップロードされたスクリーンショット</h4>
            <img src="${imageData}" style="max-width: 100%; max-height: 300px; border-radius: 8px; border: 2px solid #e0e7ff;">
          </div>

          <div style="background: #f5f7ff; padding: 20px; border-radius: 8px; border: 2px solid #667eea; margin-bottom: 16px;">
            <h4 style="color: #667eea; margin-bottom: 16px;">🤖 サボロットのアドバイス</h4>
            <div style="line-height: 1.8; white-space: pre-wrap;">${highlightedResponse}</div>
          </div>

          <button onclick="document.getElementById('screenshot-upload-area').scrollIntoView({ behavior: 'smooth', block: 'center' })" style="margin-top: 20px; width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer;">
            ↑ 別の項目を質問する
          </button>
        `;

      } catch (error) {
        console.error('AI解析エラー:', error);
        screenshotAdvice.innerHTML = `
          <div style="margin-bottom: 20px; text-align: center;">
            <h4 style="color: #667eea; margin-bottom: 12px;">📷 アップロードされたスクリーンショット</h4>
            <img src="${imageData}" style="max-width: 100%; max-height: 300px; border-radius: 8px; border: 2px solid #e0e7ff;">
          </div>
          <div style="background: #fee; padding: 16px; border-radius: 8px; border-left: 3px solid #f44;">
            <strong>⚠️ エラー：</strong><br>
            AI解析に失敗しました。もう一度試してください。<br>
            <small style="color: #999;">${error.message}</small>
          </div>
          <button onclick="document.getElementById('screenshot-upload-area').scrollIntoView({ behavior: 'smooth', block: 'center' })" style="margin-top: 20px; width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer;">
            ↑ もう一度試す
          </button>
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

// Gemini APIで商品写真を解析（中国輸入品対応）
async function analyzeProductImagesWithGemini(imageDataUrls) {
  try {
    const imageParts = imageDataUrls.map(dataUrl => {
      const base64Image = dataUrl.split(',')[1];
      return {
        inline_data: {
          mime_type: 'image/jpeg',
          data: base64Image
        }
      };
    });

    const prompt = `以下の商品写真から、商品情報を抽出してください。

写真に写っている文字やラベルから、できるだけ多くの情報を読み取ってください。

**必ずJSON形式のみで回答してください。説明文は不要です。**

抽出項目：
- name: 商品名
- brand: ブランド名/メーカー名
- model: 型番/モデル番号
- weight: 重量（g、kgなど）
- dimensions: 寸法（幅×奥行き×高さ cm）
- capacity: 容量（L、mlなど）
- wattage: 消費電力（W）
- color: 色
- features: 特徴（配列）

回答例：
{
  "name": "商品名",
  "brand": "ブランド名",
  "model": "型番",
  "weight": "重量",
  "dimensions": "寸法",
  "capacity": "容量",
  "wattage": "消費電力",
  "color": "色",
  "features": ["特徴1", "特徴2"]
}

情報が見つからない項目は空文字""にしてください。
JSON以外のテキストは含めないでください。`;

    const apiKey = GEMINI_API_KEY();
    if (!apiKey) {
      throw new Error('Gemini APIキーが設定されていません。右上の「⚙️ 設定」から設定してください。');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                ...imageParts
              ]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 2048,
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('商品写真解析結果:', data);

    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        const text = candidate.content.parts[0].text;

        try {
          // JSON modeで返ってくるのでそのままパース
          const productInfo = JSON.parse(text);
          return productInfo;
        } catch (parseError) {
          console.error('JSON解析エラー:', parseError);
          console.log('取得したテキスト:', text);

          // フォールバック: 手動でJSONを抽出
          let jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
          if (!jsonMatch) {
            jsonMatch = text.match(/```\s*([\s\S]*?)\s*```/);
          }
          if (!jsonMatch) {
            jsonMatch = text.match(/\{[\s\S]*\}/);
          }

          if (jsonMatch) {
            try {
              const jsonText = jsonMatch[1] || jsonMatch[0];
              const productInfo = JSON.parse(jsonText);
              return productInfo;
            } catch (e) {
              throw new Error('画像から情報を読み取れませんでした。より鮮明な写真をお試しください。');
            }
          }

          throw new Error('画像がはっきり写っているか確認してください。');
        }
      }
    }

    throw new Error('商品情報を抽出できませんでした');

  } catch (error) {
    console.error('商品写真解析エラー:', error);
    throw error;
  }
}

// Gemini APIでスクリーンショットを解析
async function analyzeScreenshotWithGemini(imageDataUrl, productInfo) {
  try {
    // base64データからプレフィックスを削除
    const base64Image = imageDataUrl.split(',')[1];

    // プロンプトを構築
    const productDescription = productInfo.features && productInfo.features.length > 0
      ? productInfo.features.join(' ')
      : 'なし';

    const prompt = `Amazonセラーセントラルの商品登録画面のスクリーンショットを解析してください。

商品情報：
商品名: ${productInfo.name || 'なし'} / ブランド: ${productInfo.brand || 'なし'} / JANコード: ${productInfo.janCode || 'なし'} / 型番: ${productInfo.model || 'なし'} / 重量: ${productInfo.weight || 'なし'} / 寸法: ${productInfo.dimensions || 'なし'} / 容量: ${productInfo.capacity || 'なし'} / 消費電力: ${productInfo.wattage || 'なし'} / 色: ${productInfo.color || 'なし'}
商品説明: ${productDescription.substring(0, 500)}

タスク：
1. 画面の各入力項目を識別
2. 商品情報・商品説明から重量や寸法などを推測し、具体的な入力値を提示
3. 選択肢がある場合は推奨値を提示
4. 情報がない項目は「メーカーサイト確認」または「実測」を案内

以下のカテゴリーに分けて回答してください：

## 📦 基本情報
（商品名、ブランド、JANコード、型番など）

## 📏 サイズ・重量
（寸法、重量、容量など）

## 🎨 商品詳細
（色、素材、対象年齢など）

## 📝 その他
（カテゴリー、説明文、注意事項など）

各項目は「**項目名**: 入力値」の形式で箇条書きにしてください。`;

    const apiKey = GEMINI_API_KEY();
    if (!apiKey) {
      throw new Error('Gemini APIキーが設定されていません。右上の「⚙️ 設定」から設定してください。');
    }

    // Gemini APIを呼び出し
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: base64Image
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE"
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    console.log('Gemini API レスポンス:', data);

    // レスポンスからテキストを抽出
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];

      // finishReasonをチェック
      if (candidate.finishReason === 'MAX_TOKENS') {
        console.warn('警告: 出力がトークン制限に達しました');
      }

      // contentからテキストを取得
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        return candidate.content.parts[0].text;
      }

      // textが直接ある場合
      if (candidate.text) {
        return candidate.text;
      }
    }

    // エラーの詳細を表示
    console.error('予期しないレスポンス構造:', data);
    throw new Error('AIからの回答を取得できませんでした: ' + JSON.stringify(data).substring(0, 200));

  } catch (error) {
    console.error('Gemini API エラー:', error);
    throw error;
  }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  console.log('サボロット - 初期化完了');

  // APIキーチェック
  checkAPIKeys();
});
