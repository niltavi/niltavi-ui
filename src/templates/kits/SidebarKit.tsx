import {Bell, ChartColumn, Folder, Gear, House, Persons} from "@gravity-ui/icons";
import {useMemo, useState} from "react";
import {useText} from "../../site/Locale";
import {AppSidebar, UserMenu, WorkspaceSwitcher, type SidebarGroup} from "../saas/Navigation";

/** Collapsible sidebar: groups, badges, nested items, workspace switcher and account menu. */
export function SidebarKit() {
  const text = useText();
  const [active, setActive] = useState("home");
  const [collapsed, setCollapsed] = useState(false);

  const groups = useMemo<SidebarGroup[]>(() => [
    {id: "main", items: [
      {id: "home", label: text("Home", "首页"), icon: House},
      {id: "inbox", label: text("Inbox", "收件箱"), icon: Bell, badge: 4},
      {id: "reports", label: text("Reports", "报表"), icon: ChartColumn},
    ]},
    {id: "work", label: text("Workspace", "工作区"), items: [
      {id: "projects", label: text("Projects", "项目"), icon: Folder, children: [
        {id: "atlas", label: text("Field atlas", "野外图鉴")},
        {id: "survey", label: text("Spring survey", "春季调查")},
      ]},
      {id: "people", label: text("People", "成员"), icon: Persons, badge: 12},
      {id: "settings", label: text("Settings", "设置"), icon: Gear},
    ]},
  ], [text]);

  const current = groups.flatMap((g) => g.items.flatMap((i) => [i, ...(i.children ?? [])])).find((i) => i.id === active);

  return <div className="kit-sidebar">
    <AppSidebar groups={groups} active={active} onNavigate={setActive} collapsed={collapsed} onCollapsedChange={setCollapsed}
      header={<WorkspaceSwitcher compact={collapsed} />}
      footer={<UserMenu showName={!collapsed} placement="top start" />} />
    <main className="kit-sidebar__main">
      <h4 key={active} className="nt-fade-up">{current?.label}</h4>
      <p>{collapsed
        ? text("Collapsed to an icon rail. Hover an icon for its name; the button at the bottom expands it again.", "已收起为图标栏。悬停图标可查看名称，底部按钮可再次展开。")
        : text("Use the button at the bottom of the sidebar to collapse it.", "点击侧边栏底部的按钮可收起。")}</p>
    </main>
  </div>;
}
