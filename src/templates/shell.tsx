import {Avatar, Button, SearchField, ToggleButton, ToggleButtonGroup} from "@heroui/react";
import {useLayoutEffect, useRef, useState, type ComponentType, type ReactNode, type SVGProps} from "react";
import {useText} from "../site/Locale";

export type IconType = ComponentType<SVGProps<SVGSVGElement>>;
export type NavItem = {id: string; en: string; zh: string; icon: IconType; count?: number};

/** Shared application frame: navigation rail, top bar and a scrollable workspace. */
export function AppShell({brand, nav, active, onNavigate, title, actions, children, flush}: {
  brand: string;
  nav: NavItem[];
  active: string;
  onNavigate?: (id: string) => void;
  title: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  flush?: boolean;
}) {
  const text = useText();
  return <div className="tpl-app">
    <aside className="tpl-nav" aria-label={text("Template navigation", "模板导航")}>
      <div className="tpl-nav__brand"><span className="tpl-nav__logo" aria-hidden="true">{brand.slice(0, 1)}</span><span className="tpl-nav__label">{brand}</span></div>
      <nav className="tpl-nav__list">
        {nav.map(({id, en, zh, icon: Icon, count}) => <button key={id} type="button" className="tpl-nav__item" aria-current={active === id ? "page" : undefined} onClick={() => onNavigate?.(id)} title={text(en, zh)}>
          <Icon aria-hidden="true" width={16} height={16} />
          <span className="tpl-nav__label">{text(en, zh)}</span>
          {count ? <span className="tpl-nav__count">{count}</span> : null}
        </button>)}
      </nav>
      <div className="tpl-nav__user">
        <Avatar size="sm" color="accent"><Avatar.Fallback>LW</Avatar.Fallback></Avatar>
        <div className="tpl-nav__label tpl-nav__who"><strong>Lin Wei</strong><span>lin@niltavi.com</span></div>
      </div>
    </aside>
    <div className="tpl-body">
      <header className="tpl-topbar">
        <div className="tpl-topbar__title">{title}</div>
        <SearchField aria-label={text("Search", "搜索")} className="tpl-topbar__search">
          <SearchField.Group><SearchField.SearchIcon /><SearchField.Input placeholder={text("Search…", "搜索…")} /></SearchField.Group>
        </SearchField>
        <div className="tpl-topbar__actions">{actions}</div>
      </header>
      <div className={flush ? "tpl-content tpl-content--flush" : "tpl-content"}>{children}</div>
    </div>
  </div>;
}

export function IconButton({label, icon: Icon, variant = "ghost"}: {label: string; icon: IconType; variant?: "ghost" | "tertiary" | "secondary"}) {
  return <Button isIconOnly size="sm" variant={variant} aria-label={label}><Icon aria-hidden="true" width={16} height={16} /></Button>;
}

export function Segmented<T extends string>({label, options, value, onChange}: {label: string; options: {id: T; label: string}[]; value: T; onChange: (value: T) => void}) {
  return <ToggleButtonGroup aria-label={label} size="sm" selectionMode="single" disallowEmptySelection selectedKeys={[value]} onSelectionChange={(keys) => {const next = [...keys][0]; if (next) onChange(next as T);}}>
    {options.map((option, index) => <ToggleButton key={option.id} id={option.id}>{index > 0 && <ToggleButtonGroup.Separator />}{option.label}</ToggleButton>)}
  </ToggleButtonGroup>;
}

export function Delta({value}: {value: number}) {
  const up = value >= 0;
  return <span className="tpl-delta" data-trend={up ? "up" : "down"}>{up ? "↑" : "↓"} {Math.abs(value).toFixed(1)}%</span>;
}

export function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

const avatarColors = ["accent", "success", "warning", "danger", "default"] as const;
export function avatarColor(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return avatarColors[hash % avatarColors.length];
}

export function PersonAvatar({name, size = "sm"}: {name: string; size?: "sm" | "md" | "lg"}) {
  return <Avatar size={size} color={avatarColor(name)}><Avatar.Fallback>{initials(name)}</Avatar.Fallback></Avatar>;
}

/** Charts draw in real pixels so tick labels never stretch with the frame. */
function useWidth(fallback = 600) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(fallback);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(240, Math.round(entry.contentRect.width))));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

/** Smooth area chart with optional comparison series. */
export function AreaChart({series, labels, height = 180, label}: {series: {values: number[]; color: string}[]; labels: string[]; height?: number; label: string}) {
  const [ref, w] = useWidth();
  const h = height, pad = {t: 12, r: 8, b: 24, l: 36};
  const max = Math.max(...series.flatMap((s) => s.values)) * 1.1;
  const x = (i: number) => pad.l + (i / (labels.length - 1)) * (w - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - v / max) * (h - pad.t - pad.b);
  const ticks = [0, .25, .5, .75, 1].map((f) => f * max);
  const path = (values: number[]) => values.map((v, i) => {
    if (i === 0) return `M${x(i)},${y(v)}`;
    const cx = (x(i - 1) + x(i)) / 2;
    return `C${cx},${y(values[i - 1])} ${cx},${y(v)} ${x(i)},${y(v)}`;
  }).join(" ");
  return <div ref={ref}><svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="tpl-chart" role="img" aria-label={label}>
    {ticks.map((t) => <g key={t}>
      <line x1={pad.l} x2={w - pad.r} y1={y(t)} y2={y(t)} className="tpl-chart__grid" />
      <text x={pad.l - 8} y={y(t) + 3} className="tpl-chart__tick" textAnchor="end">{t >= 1000 ? `${Math.round(t / 1000)}k` : Math.round(t)}</text>
    </g>)}
    {labels.map((l, i) => <text key={l + i} x={x(i)} y={h - 6} className="tpl-chart__tick" textAnchor="middle">{l}</text>)}
    {series.map((s, si) => <g key={si}>
      {si === 0 && <path d={`${path(s.values)} L${x(s.values.length - 1)},${h - pad.b} L${x(0)},${h - pad.b} Z`} fill={s.color} opacity={.12} />}
      <path d={path(s.values)} fill="none" stroke={s.color} strokeWidth={2} strokeDasharray={si > 0 ? "4 4" : undefined} />
    </g>)}
  </svg></div>;
}

export function BarChart({values, labels, label, highlight}: {values: number[][]; labels: string[]; label: string; highlight?: number}) {
  const [ref, w] = useWidth();
  const h = 180, pad = {t: 8, b: 22};
  const max = Math.max(...values.flat()) * 1.1;
  const band = w / labels.length;
  const groups = values[0].length;
  const barW = Math.min(18, (band * .6) / groups);
  return <div ref={ref}><svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="tpl-chart" role="img" aria-label={label}>
    {[.25, .5, .75, 1].map((f) => <line key={f} x1={0} x2={w} y1={pad.t + (1 - f) * (h - pad.t - pad.b)} y2={pad.t + (1 - f) * (h - pad.t - pad.b)} className="tpl-chart__grid" />)}
    {labels.map((l, i) => {
      const cx = band * i + band / 2;
      return <g key={l + i} opacity={highlight === undefined || highlight === i ? 1 : .45}>
        {values[i].map((v, g) => {
          const bh = (v / max) * (h - pad.t - pad.b);
          return <rect key={g} x={cx - (groups * barW + (groups - 1) * 3) / 2 + g * (barW + 3)} y={h - pad.b - bh} width={barW} height={bh} rx={3} fill={`var(--chart-${g + 1})`} />;
        })}
        <text x={cx} y={h - 6} className="tpl-chart__tick" textAnchor="middle">{l}</text>
      </g>;
    })}
  </svg></div>;
}

export function Sparkline({values, color = "var(--accent)"}: {values: number[]; color?: string}) {
  const w = 96, h = 32, min = Math.min(...values), max = Math.max(...values);
  const points = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - 2 - ((v - min) / (max - min || 1)) * (h - 4)}`).join(" ");
  return <svg viewBox={`0 0 ${w} ${h}`} className="tpl-spark" aria-hidden="true"><polyline points={points} fill="none" stroke={color} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" /></svg>;
}

export function Donut({parts, label, center}: {parts: {value: number; color: string}[]; label: string; center: ReactNode}) {
  const total = parts.reduce((sum, p) => sum + p.value, 0);
  const r = 42, c = 2 * Math.PI * r;
  let offset = 0;
  return <div className="tpl-donut">
    <svg viewBox="0 0 100 100" role="img" aria-label={label}>
      <circle cx={50} cy={50} r={r} fill="none" stroke="var(--surface-tertiary)" strokeWidth={10} />
      {parts.map((p, i) => {
        const len = (p.value / total) * c;
        const el = <circle key={i} cx={50} cy={50} r={r} fill="none" stroke={p.color} strokeWidth={10} strokeDasharray={`${Math.max(len - 1.5, 0)} ${c}`} strokeDashoffset={-offset} transform="rotate(-90 50 50)" />;
        offset += len;
        return el;
      })}
    </svg>
    <div className="tpl-donut__center">{center}</div>
  </div>;
}
