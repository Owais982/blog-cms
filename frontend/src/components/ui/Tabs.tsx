import { cn } from "@/lib/utils";

export interface TabItem<K extends string> {
  key: K;
  label: string;
  count?: number;
}

export interface TabsProps<K extends string> {
  items: TabItem<K>[];
  value: K;
  onChange: (key: K) => void;
  label: string;
}

/** Underlined filter tabs with optional counts. */
export function Tabs<K extends string>({ items, value, onChange, label }: TabsProps<K>) {
  return (
    <div className="border-b border-line">
      <div
        role="tablist"
        aria-label={label}
        className="-mb-px flex gap-0.5 overflow-x-auto sm:gap-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const active = item.key === value;
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(item.key)}
              className={cn(
                "flex shrink-0 cursor-pointer items-center gap-1.5 border-b-2 px-1.5 py-2 text-[12.5px] whitespace-nowrap transition-colors sm:px-2.5",
                active ? "border-ink font-bold text-ink" : "border-transparent font-medium text-muted hover:text-ink",
              )}
            >
              {item.label}
              {item.count !== undefined && (
                <span
                  className={cn(
                    "rounded-full px-1.5 font-mono text-[10px] font-bold tabular-nums",
                    active ? "bg-green text-ink" : "bg-hover text-muted",
                  )}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}