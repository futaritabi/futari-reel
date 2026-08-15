# 週末ふたり旅 - GitHub Pagesスターター

## 目的
Manusに依存せず、Instagramの温泉・旅館リールから予約アフィリエイトへつなぐ無料の静的サイト土台です。

## ファイル
- `index.html` … トップページ
- `style.css` … スマホ優先のデザイン
- `app.js` … 宿の表示・検索・地域フィルター
- `stays.json` … 宿データ。将来n8nから自動追記する想定

## 宿を追加する
`stays.json` に以下の形で追加します。

```json
{
  "id": "hotel-id",
  "name": "宿名",
  "region": "長野・白骨温泉",
  "hook": "冒頭キャッチコピー",
  "features": ["客室露天風呂", "絶景", "記念日向け"],
  "image": "利用許諾のある画像URL",
  "reel_url": "InstagramリールURL",
  "affiliate_url": "アフィリエイトURL"
}
```

## GitHub Pagesで公開する
1. GitHubで公開リポジトリを作る
2. この5ファイルをリポジトリ直下へアップロード
3. Settings → Pages
4. Build and deployment で `Deploy from a branch`
5. Branch を `main` / `(root)` にして保存

## 次の自動化予定
1. n8nで宿候補収集
2. AIで宿選定・キャッチコピー・特徴生成
3. `stays.json` を自動更新
4. FFmpegでReelテンプレート生成
5. Meta Instagram APIで投稿
6. 投稿URLを `stays.json` に反映
7. アフィリエイト成果計測
