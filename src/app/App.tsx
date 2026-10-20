import { formatMonth } from "../lib/month";
import { useKakeibo } from "../store/KakeiboProvider";
import { featuresIn } from "./features";
import { useMonth } from "./month";

export function App() {
  const month = useMonth();
  const { loadError } = useKakeibo();
  const header = featuresIn("header");
  const main = featuresIn("main");
  const side = featuresIn("side");

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
          <h1 className="text-lg font-bold">家計簿</h1>
          <p className="text-text-muted" aria-live="polite">
            {formatMonth(month)}
          </p>
          <div className="ml-auto flex items-center gap-2">
            {header.map(({ name, Component }) => (
              <Component key={name} />
            ))}
          </div>
        </div>
      </header>
      {loadError !== null && (
        <p
          role="alert"
          className="mx-auto mt-4 max-w-6xl rounded-md border border-danger px-4 py-3 text-danger"
        >
          {loadError} 保存されたデータはそのまま残しています。
        </p>
      )}
      <main className="mx-auto grid max-w-6xl gap-4 px-4 py-6 lg:grid-cols-3">
        <div
          className={`flex flex-col gap-4 ${side.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}`}
        >
          {main.map(({ name, Component }) => (
            <Component key={name} />
          ))}
        </div>
        {side.length > 0 && (
          <div className="flex flex-col gap-4">
            {side.map(({ name, Component }) => (
              <Component key={name} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
