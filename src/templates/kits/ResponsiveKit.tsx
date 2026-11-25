import {Bars, Bell, ChartColumn, Display, Folder, Gear, House, LayoutSideContentLeft, Smartphone} from "@gravity-ui/icons";
import {Avatar, Button, Card, Drawer} from "@heroui/react";
import {useMemo, useState, type ComponentType, type SVGProps} from "react";
import {useText} from "../../site/Locale";
import {AppSidebar, UserMenu} from "../saas/Navigation";
import {Segmented} from "../shell";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;
type Viewport = "fit" | "desktop" | "tablet" | "mobile";

/** Stage widths used to preview each layout; "fit" follows the page. */
const stageWidth: Record<Viewport, string> = {fit: "100%", desktop: "1024px", tablet: "720px", mobile: "375px"};

/**
 * A shell that follows its own width:
 * ≥ 900px the full sidebar, 600–899px its icon rail (account stays bottom-left),
 * < 600px a top bar with a drawer and bottom tabs.
 */
export function ResponsiveShell({items, active, onNavigate, brand = "Niltavi"}: {
  items: {id: string; label: string; icon: Icon}[];
  active: string;
  onNavigate: (id: string) => void;
  brand?: string;
}) {
  const text = useText();
  const [menuOpen, setMenuOpen] = useState(false);
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const current = items.find((i) => i.id === active);
  const go = (id: string) => { onNavigate(id); setMenuOpen(false); };

  const groups = useMemo(() => [{id: "main", items}], [items]);

  const drawerList = <ul className="kit-rsp__nav">
    {items.map(({id, label, icon: Glyph}) => <li key={id}>
      <button type="button" className="kit-rsp__link" aria-current={active === id ? "page" : undefined} onClick={() => go(id)} title={label}>
        <Glyph aria-hidden="true" width={16} height={16} /><span>{label}</span>
      </button>
    </li>)}
  </ul>;

  return <div ref={setRoot} className="kit-rsp">
    <div className="kit-rsp__layout">
    <AppSidebar groups={groups} active={active} onNavigate={go} autoCollapseBelow={900} label={text("Main navigation", "主导航")}
      header={<div className="nt-side__brand"><span className="tpl-nav__logo" aria-hidden="true">{brand.slice(0, 1)}</span><span>{brand}</span></div>}
      footer={(folded) => <UserMenu showName={!folded} placement="top start" />} />
    <div className="kit-rsp__main">
      <header className="kit-rsp__top">
        <Button isIconOnly size="sm" variant="ghost" className="kit-rsp__menu" aria-label={text("Open menu", "打开菜单")} onPress={() => setMenuOpen(true)}><Bars aria-hidden="true" width={18} height={18} /></Button>
        <h4>{current?.label}</h4>
        <Avatar size="sm" color="accent" className="kit-rsp__me"><Avatar.Fallback>LW</Avatar.Fallback></Avatar>
      </header>
      <div className="kit-rsp__body" key={active}>
        <div className="kit-rsp__grid">
          {[0, 1, 2, 3, 4, 5].map((n) => <Card key={n} className="kit-rsp__card nt-fade-up" style={{"--i": n} as React.CSSProperties}>
            <span className="kit-rsp__ph kit-rsp__ph--title" /><span className="kit-rsp__ph" /><span className="kit-rsp__ph kit-rsp__ph--short" />
          </Card>)}
        </div>
      </div>
      <nav className="kit-rsp__tabs" aria-label={text("Main navigation", "主导航")}>
        {items.slice(0, 4).map(({id, label, icon: Glyph}) => <button key={id} type="button" className="kit-rsp__tab" aria-current={active === id ? "page" : undefined} onClick={() => go(id)}>
          <Glyph aria-hidden="true" width={18} height={18} /><span>{label}</span>
        </button>)}
      </nav>
    </div>
    </div>
    {/* The drawer opens inside the shell, so it stays within the preview stage. */}
    <Drawer.Backdrop isOpen={menuOpen} onOpenChange={setMenuOpen} UNSTABLE_portalContainer={root ?? undefined}>
      <Drawer.Content placement="left">
        <Drawer.Dialog aria-label={text("Menu", "菜单")}>
          <Drawer.CloseTrigger />
          <Drawer.Header><Drawer.Heading>{brand}</Drawer.Heading></Drawer.Header>
          <Drawer.Body>{drawerList}</Drawer.Body>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  </div>;
}

export function ResponsiveKit() {
  const text = useText();
  const [viewport, setViewport] = useState<Viewport>("fit");
  const [active, setActive] = useState("home");
  const items = [
    {id: "home", label: text("Home", "首页"), icon: House},
    {id: "projects", label: text("Projects", "项目"), icon: Folder},
    {id: "reports", label: text("Reports", "报表"), icon: ChartColumn},
    {id: "inbox", label: text("Inbox", "通知"), icon: Bell},
    {id: "settings", label: text("Settings", "设置"), icon: Gear},
  ];
  const sizes = [
    {id: "fit" as const, label: text("Fit", "自适应")},
    {id: "desktop" as const, label: text("Desktop", "桌面")},
    {id: "tablet" as const, label: text("Tablet", "平板")},
    {id: "mobile" as const, label: text("Mobile", "手机")},
  ];
  const ViewIcon = {fit: LayoutSideContentLeft, desktop: Display, tablet: LayoutSideContentLeft, mobile: Smartphone}[viewport];

  return <div className="kit-stage">
    <div className="kit-stage__bar">
      <span className="tpl-meta"><ViewIcon aria-hidden="true" width={14} height={14} />{text("Preview width", "预览宽度")} · {stageWidth[viewport]}</span>
      <Segmented label={text("Preview width", "预览宽度")} options={sizes} value={viewport} onChange={setViewport} />
    </div>
    <div className="kit-stage__canvas">
      <div className="kit-stage__device" style={{width: `min(${stageWidth[viewport]}, 100%)`}}>
        <ResponsiveShell items={items} active={active} onNavigate={setActive} />
      </div>
    </div>
  </div>;
}
