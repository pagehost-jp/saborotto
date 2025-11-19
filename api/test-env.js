// 環境変数テスト用エンドポイント
module.exports = async (req, res) => {
  const rawKey = process.env.STRIPE_SECRET_KEY;
  const trimmedKey = rawKey?.trim();

  return res.status(200).json({
    isDefined: !!rawKey,
    isNotEmpty: rawKey !== '' && rawKey !== undefined && rawKey !== null,
    lengthRaw: rawKey?.length,
    lengthTrimmed: trimmedKey?.length,
    startsCorrectly: trimmedKey?.startsWith('sk_test_'),
    first20: trimmedKey?.substring(0, 20),
    last10: trimmedKey?.substring(trimmedKey.length - 10),
    hasWhitespace: rawKey !== trimmedKey,
    charCodeAt0: rawKey?.charCodeAt(0),
    charCodeAtEnd: rawKey?.charCodeAt(rawKey?.length - 1)
  });
};
