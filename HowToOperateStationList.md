# 出題設定の運用

## 駅を追加・削除する手順

1. 最新の公開済みコード・出題設定を使います。
2. `src/constants/station_names_5_katakana.ts` の駅データを編集します。駅名はアイウエオ順に並べています。記載順は今後の出題順に影響しません。
3. 未来の適用日を指定し、スケジュールを更新します（以下の日付は例です）。

```sh
npm run schedule:update -- 2026-10-01
```

4. 追加・削除駅、残りの出題数、次の巡回開始日、基準日を確認します。
5. テスト・ビルドし、駅データ `src/constants/station_names_5_katakana.ts` と `src/constants/schedule.json` の２つのファイルをコミット・デプロイします。

## 出題リストの確認

以下のコマンドで、現在のサイクルの指定した日付以降の出題リストを確認できます。

```sh
npm run schedule:list -- 2026-10-01 --output schedule-list.csv
```

## 詳細仕様と公開前の確認

変更の扱い、初回移行、適用日、公開時の注意、移行用処理の撤去条件は [SCHEDULE.md](SCHEDULE.md) を参照してください。仕様の説明はそちらを正本とします。
