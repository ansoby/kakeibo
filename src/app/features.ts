// 機能は src/features/<名前>/index.tsx が `feature` を export するだけで画面に載る。
// 機能を足すたびに共通のファイルを書き換えないためで、並行して作った機能どうしが衝突しない。
import type { ComponentType } from "react";

/**
 * 機能を置く場所。
 * - header: ヘッダーの右側（ボタンなど）
 * - main: 左の広い列
 * - side: 右の列（狭い画面では main の下）
 */
export type Slot = "header" | "main" | "side";

export type Feature = {
  slot: Slot;
  /** 同じ場所の中での並び順。小さいほど先（左・上）。 */
  order: number;
  Component: ComponentType;
};

const modules = import.meta.glob<{ feature: Feature }>("../features/*/index.tsx", { eager: true });

/** 画面に載った機能。name はディレクトリの名前で、描くときの key に使う。 */
export type LoadedFeature = Feature & { name: string };

const features: LoadedFeature[] = Object.entries(modules)
  .map(([path, module]) => ({ ...module.feature, name: path.split("/").at(-2) ?? path }))
  .sort((a, b) => a.order - b.order);

export function featuresIn(slot: Slot): LoadedFeature[] {
  return features.filter((feature) => feature.slot === slot);
}
