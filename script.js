// ステップ間の移動
function showStep0() {
  document.querySelectorAll('.step-section').forEach(section => {
    section.classList.add('hidden');
  });
  document.querySelectorAll('.step-section')[0].classList.remove('hidden');
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
  // チェックされた項目を取得
  const checkedFields = Array.from(document.querySelectorAll('input[name="field"]:checked'))
    .map(input => input.value);

  if (checkedFields.length === 0) {
    alert('少なくとも1つの項目を選択してください');
    return;
  }

  // アドバイスを生成
  generateAdvice(checkedFields);

  // STEP2を表示
  document.querySelectorAll('.step-section').forEach(section => {
    section.classList.add('hidden');
  });
  document.getElementById('step2').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// タブの切り替え
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.dataset.tab;

    // タブボタンのアクティブ状態を切り替え
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // タブコンテンツの表示を切り替え
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active');
  });
});

// アドバイス生成
function generateAdvice(fields) {
  const container = document.getElementById('advice-container');
  container.innerHTML = '';

  // アドバイスデータベース
  const adviceData = {
    'product-name': {
      title: '商品名',
      content: '商品の正式名称を入力します。ブランド名、型番、商品の特徴を含めると分かりやすいです。',
      example: '例：TOSHIBA 石窯オーブン ER-Y60, グランホワイト, 23L容量, 角皿式スチーム機能搭載',
      tip: 'パッケージの表面に書かれている商品名をそのまま入力してください。'
    },
    'product-type': {
      title: '商品タイプ',
      content: '商品のカテゴリを選択します。Amazonが自動的に提案してくれる場合もあります。',
      example: '例：電子レンジ → システムが「電子レンジ」を提案',
      tip: '商品名を入力すると、システムが自動的にカテゴリを提案します。最も近いものを選んでください。'
    },
    'brand': {
      title: 'ブランド名',
      content: 'メーカー名またはブランド名を入力します。',
      example: '例：TOSHIBA, 東芝, Panasonic, ソニーなど',
      tip: 'パッケージに記載されているブランド名をそのまま入力してください。ブランドがない場合は「ノーブランド品」にチェック。'
    },
    'jan-code': {
      title: '外部製品ID（JANコード）',
      content: 'バーコードの下にある13桁または8桁の数字です。',
      example: '例：4901234567890（13桁）または49012345（8桁）',
      tip: 'バーコードの下にある数字をそのまま入力してください。ハイフンは不要です。本の場合はISBNコード（978で始まる13桁）を入力します。'
    },
    'browse-node': {
      title: '推奨されるブラウズノード',
      content: '詳細なカテゴリを選択します。プルダウンメニューから最も適切なものを選んでください。',
      example: '例：家電＆カメラ > 家電 > キッチン家電 > 電子レンジ・オーブン > スチームオーブン・レンジ',
      tip: '商品が最も当てはまるカテゴリを選択してください。複数表示される場合は、最も具体的なものを選びます。'
    },
    'description': {
      title: '商品説明',
      content: '商品の詳細な説明文を500文字以内で入力します。商品の特徴、使い方、メリットなどを記載します。',
      example: '例：東芝の石窯オーブン ER-Y60は、コンパクトながら多機能な電子レンジです。23Lの使いやすいサイズで、角皿式スチーム機能を搭載し...',
      tip: 'パッケージの裏面や側面に書かれている説明文を参考にしてください。商品の魅力が伝わるように書きましょう。'
    },
    'bullet-points': {
      title: '商品の仕様（箇条書き5つ）',
      content: '商品の特徴を箇条書きで5つまで入力します。各項目は簡潔に、商品の魅力をアピールします。',
      example: '例：\n・容量: 23Lの大容量で、家族の調理にも対応\n・角皿式スチーム機能: 食材をジューシーに仕上げる\n・グランホワイトのスタイリッシュなデザイン\n・1段式電子レンジ: シンプルな操作\n・石窯オーブン: TOSHIBAの石窯オーブン技術により、本格的な調理が可能',
      tip: 'パッケージに書かれている特徴やセールスポイントを箇条書きにしてください。'
    },
    'images': {
      title: '商品画像',
      content: 'メイン画像1枚と、追加画像を最大8枚までアップロードできます。',
      example: '・メイン画像：商品全体が白背景で写っている\n・追加画像：商品の詳細、使用例、パッケージなど',
      tip: '白背景で商品全体が写っている画像をメインに設定してください。追加画像では、商品の特徴や使い方が分かる写真を追加します。'
    },
    'model-number': {
      title: '品番・型番',
      content: 'メーカーの型番を入力します。',
      example: '例：ER-Y60, ABC-1234など',
      tip: 'パッケージや商品本体に記載されている型番を入力してください。'
    },
    'manufacturer': {
      title: 'メーカー名',
      content: '製造メーカーを入力します。',
      example: '例：東芝',
      tip: 'ブランド名と異なる場合は、製造メーカーを入力してください。'
    },
    'color': {
      title: '色',
      content: '商品の色を選択または入力します。',
      example: '例：グランホワイト, ブラック, シルバーなど',
      tip: 'パッケージに記載されている色名をそのまま入力してください。'
    },
    'material': {
      title: '素材',
      content: '商品の素材を選択します。複数選択可能です。',
      example: '例：プラスチック, ガラス, 金属など',
      tip: 'パッケージの仕様欄に記載されている素材を選択してください。'
    },
    'dimensions': {
      title: '商品の寸法',
      content: '商品の幅、奥行き、高さを単位付きで入力します。',
      example: '例：幅45.0cm、奥行き30.0cm、高さ40.0cm',
      tip: 'パッケージの仕様欄に記載されている寸法をそのまま入力してください。単位（cm、mmなど）を正しく選択してください。'
    },
    'weight': {
      title: '商品の重量',
      content: '商品本体の重さを単位付きで入力します。',
      example: '例：12.5kg',
      tip: 'パッケージに記載されている重量を入力してください。'
    },
    'capacity': {
      title: '容量',
      content: '商品の容量を単位付きで入力します。',
      example: '例：23リットル',
      tip: '電子レンジなら庫内容量、ボトルなら液体容量などを入力します。'
    },
    'wattage': {
      title: '電力消費・ワット数',
      content: '消費電力を単位付きで入力します。',
      example: '例：1000ワット',
      tip: 'パッケージの仕様欄に「消費電力」として記載されています。'
    },
    'sku': {
      title: 'SKU',
      content: '在庫管理番号です。自分で決めることができます。',
      example: '例：ABC123, TOSHIBA-ERY60など',
      tip: '商品を識別しやすい番号を自由に設定してください。JANコードや型番を使うと便利です。'
    },
    'price': {
      title: '在庫数',
      content: '販売する数量を入力します。',
      example: '例：10個',
      tip: '手元にある在庫数を入力してください。FBAの場合は、Amazonに送る数量を入力します。'
    },
    'selling-price': {
      title: '商品の販売価格',
      content: '販売価格を税込で入力します。',
      example: '例：19,800円',
      tip: '利益が出る価格を設定してください。Amazonの手数料（約15%）を考慮して価格設定しましょう。'
    },
    'condition': {
      title: '商品の状態',
      content: '新品か中古かを選択します。',
      example: '新品、中古－ほぼ新品、中古－非常に良い、中古－良い、中古－可',
      tip: 'せどりで仕入れた新品商品の場合は「新品」を選択してください。'
    },
    'fulfillment': {
      title: 'フルフィルメントチャネル',
      content: '自己配送かFBAかを選択します。',
      example: '・自分で配送する\n・Amazonが発送し、カスタマーサービスを提供します（FBA）',
      tip: 'FBAを利用する場合は「Amazonが発送し...」を選択してください。おすすめです。'
    },
    'package-dimensions': {
      title: 'パッケージ寸法',
      content: '梱包後のサイズを入力します。商品本体ではなく、パッケージのサイズです。',
      example: '例：長さ45.0cm、幅45.0cm、高さ35.0cm',
      tip: '商品が入っている箱のサイズを測って入力してください。FBAの送料計算に使われます。'
    },
    'package-weight': {
      title: '商品パッケージ重量',
      content: '梱包後の重さを入力します。',
      example: '例：14kg',
      tip: '商品と箱を含めた重さを測って入力してください。'
    },
    'country-of-origin': {
      title: '原産国/地域',
      content: '商品が製造された国を選択します。',
      example: '例：中国、日本、アメリカなど',
      tip: 'パッケージに「Made in 〇〇」と記載されています。'
    },
    'warranty': {
      title: '保証内容',
      content: 'メーカー保証の有無と期間を入力します。',
      example: '例：2年間のメーカー保証',
      tip: 'パッケージや取扱説明書に保証について記載されています。保証がない場合は「保証なし」と入力してください。'
    },
    'hazmat': {
      title: '危険物規制の種類',
      content: '危険物に該当するかを選択します。',
      example: '・該当なし（ほとんどの商品）\n・危険物ラベル(GHS)（電池、化学薬品など）\n・保管、輸送（特殊な商品）',
      tip: 'ほとんどの商品は「該当なし」でOKです。リチウム電池を含む商品や化学薬品の場合は該当する項目を選択してください。'
    }
  };

  if (fields.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #888;">項目が選択されていません。</p>';
    return;
  }

  fields.forEach(fieldValue => {
    const advice = adviceData[fieldValue];
    if (!advice) return;

    const card = document.createElement('div');
    card.className = 'advice-card';
    card.innerHTML = `
      <h3>📌 ${advice.title}</h3>
      <div class="advice-content">
        <p>${advice.content}</p>
        ${advice.example ? `<div class="advice-example"><strong>記入例：</strong><br>${advice.example.replace(/\n/g, '<br>')}</div>` : ''}
        ${advice.tip ? `<div class="advice-tip"><strong>💡 ヒント：</strong><br>${advice.tip}</div>` : ''}
      </div>
    `;
    container.appendChild(card);
  });
}

// スクリーンショットアップロード
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
  if (screenshotAdvice) {
    screenshotAdvice.classList.remove('hidden');
    screenshotAdvice.innerHTML = '<p style="text-align: center;">解析中...</p>';

    // シミュレーション（実際はAI APIを使用）
    await new Promise(resolve => setTimeout(resolve, 1500));

    screenshotAdvice.innerHTML = `
      <h4 style="color: #667eea; margin-bottom: 12px;">📸 スクリーンショット解析結果</h4>
      <p style="margin-bottom: 12px;">
        <strong>この画面は「商品詳細」タブの入力欄のようです。</strong>
      </p>
      <div style="background: #f5f7ff; padding: 16px; border-radius: 8px; margin-bottom: 12px;">
        <strong>入力すべき項目：</strong><br>
        <ul style="margin-left: 20px; margin-top: 8px; line-height: 1.8;">
          <li>品番・型番：商品パッケージに記載されている型番を入力</li>
          <li>メーカー名：製造メーカーを入力</li>
          <li>色：商品の色を選択</li>
          <li>素材：商品の素材を複数選択可能</li>
        </ul>
      </div>
      <div style="background: #fff8e1; padding: 16px; border-radius: 8px; border-left: 3px solid #ffc107;">
        <strong>💡 ヒント：</strong><br>
        実際の商品写真をアップロードすると、より具体的なアドバイスができます。
      </div>
    `;
  }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  console.log('サボツール - 初期化完了');
});
