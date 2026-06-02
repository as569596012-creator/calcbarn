"use client";

import { useEffect, useMemo, useState } from "react";
import { getCalculator } from "@/lib/calculators";

// 只接收 slug:含 compute 函数的定义不能跨 RSC 边界序列化,所以由客户端自己从注册表取。
export default function CalculatorClient({ slug }: { slug: string }) {
  const calc = getCalculator(slug);

  const initial = useMemo(() => {
    const base: Record<string, number> = {};
    calc?.inputs.forEach((i) => (base[i.id] = i.default));
    return base;
  }, [calc]);

  const [values, setValues] = useState<Record<string, number>>(initial);
  const [copied, setCopied] = useState(false);

  // 从 URL 查询参数读取初始值(可分享的结果链接)
  useEffect(() => {
    if (!calc) return;
    const params = new URLSearchParams(window.location.search);
    let changed = false;
    const next = { ...initial };
    calc.inputs.forEach((i) => {
      const raw = params.get(i.id);
      if (raw !== null && raw !== "" && isFinite(Number(raw))) {
        next[i.id] = Number(raw);
        changed = true;
      }
    });
    if (changed) setValues(next);
  }, [calc, initial]);

  if (!calc) return null;

  const results = calc.compute(values);

  const update = (id: string, raw: string) => {
    const n = raw === "" ? 0 : Number(raw);
    setValues((prev) => ({ ...prev, [id]: isFinite(n) ? n : 0 }));
  };

  const copyLink = async () => {
    const params = new URLSearchParams();
    calc.inputs.forEach((i) => params.set(i.id, String(values[i.id])));
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 忽略
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* 输入区 */}
        <div className="space-y-4">
          {calc.inputs.map((input) => (
            <label key={input.id} className="block">
              <span className="text-sm font-medium text-gray-700">{input.label}</span>
              <div className="mt-1 flex items-center rounded-lg border border-gray-300 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500">
                <input
                  type="number"
                  inputMode="decimal"
                  min={input.min}
                  step={input.step}
                  value={Number.isNaN(values[input.id]) ? "" : values[input.id]}
                  onChange={(e) => update(input.id, e.target.value)}
                  className="w-full rounded-lg px-3 py-2.5 outline-none"
                />
                {input.unit && (
                  <span className="px-3 text-sm text-gray-400">{input.unit}</span>
                )}
              </div>
            </label>
          ))}
        </div>

        {/* 结果区 */}
        <div className="rounded-xl bg-gray-50 p-5">
          <div className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Result
          </div>
          <ul className="mt-3 space-y-3">
            {results.map((r, i) => (
              <li
                key={i}
                className={
                  r.highlight
                    ? "rounded-lg bg-brand-50 p-3"
                    : "flex items-baseline justify-between"
                }
              >
                {r.highlight ? (
                  <>
                    <div className="text-sm text-brand-800">{r.label}</div>
                    <div className="text-2xl font-extrabold text-brand-700">{r.value}</div>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-gray-600">{r.label}</span>
                    <span className="font-semibold text-gray-900">{r.value}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
          <button
            onClick={copyLink}
            className="mt-5 w-full rounded-lg border border-brand-600 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            {copied ? "Link copied!" : "Copy shareable link"}
          </button>
        </div>
      </div>
    </div>
  );
}
