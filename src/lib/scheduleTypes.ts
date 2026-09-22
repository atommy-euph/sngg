/** カタカナの回答名をキーに、同じ読みの駅のリンクをまとめたデータ。 */
export type StationData = { [name: string]: { url: string; title: string }[] };
interface RevisionBase {
  /** Wikipediaの基準日（処理実行日のローカル日付）。effectiveから表示する。 */
  referenceDate: string;
  /** この設定を使い始める端末のローカル日付（YYYY-MM-DD）。 */
  effective: string;
  /** 巡回番号。駅変更だけでは増やさず、全体の一巡ごとに増やす。 */
  cycle: number;
  /** 全体を最後にシャッフルした日。未出題分の並べ替えでは更新しない。 */
  fullShuffle: string;
  /** effectiveの前日までに同じ巡回で出題済みの駅。順序は意味を持たない。 */
  seen: string[];
  /** この設定の期間に有効な回答駅とリンク。基準日と同時に切り替える。 */
  active: StationData;
}
/** 移行前だけに使う旧方式。新方式の計算条件とは混在させない。 */
export interface LegacyRevision extends RevisionBase {
  legacy: true;
  /** 旧方式の出題順。配信時は移行日前までの必要な範囲に限定する。 */
  order: string[];
}
/** 移行後に使用する、出題順を再現するための設定。 */
export interface ShuffleRevision extends RevisionBase {
  /** 省略時も新方式。既存JSONとの互換性を保つ。 */
  legacy?: false;
  /** シャッフル元の候補駅。保存時は文字コード順で、出題順ではない。 */
  candidates: string[];
  /** 疑似乱数の初期値を作る文字列。同じ候補・シードで同じ並びを再現する。 */
  seed: string;
  /** シャッフル開始直前の答え。省略時は先頭の連続回避を行わない。 */
  previous?: string;
  /** 再現した並びの先頭から読み飛ばす件数。省略時0。リンク修正時の順序維持に使用。 */
  skip?: number;
}
export type Revision = LegacyRevision | ShuffleRevision;
export interface Schedule {
  /** 保存形式のバージョン。今回の整理では形式を変更しない。 */
  version: number;
  /** 適用日の昇順に保持する履歴。指定日以下で最後の設定が有効。 */
  revisions: Revision[];
}
