import {Code, Eye} from "@gravity-ui/icons";
import {Tabs} from "@heroui/react";
import {memo, useEffect, useState, type ComponentType} from "react";
import {useLocale, useText} from "../site/Locale";
import {scrollToSection} from "../site/navigation";
import {componentKits, templateSections} from "./catalog";
import ChatTemplate from "./Chat";
import CrmTemplate from "./Crm";
import DashboardTemplate from "./Dashboard";
import FinancesTemplate from "./Finances";
import MailTemplate from "./Mail";
import {SourceView} from "./SourceView";
import {AIChatWorkspace} from "./ai/AIChatWorkspace";
import {AgentKit} from "./kits/AgentKit";
import {AuthKit} from "./kits/AuthKit";
import {BannerKit} from "./kits/BannerKit";
import {ResponsiveKit} from "./kits/ResponsiveKit";
import {SidebarKit} from "./kits/SidebarKit";
import {ToolbarKit} from "./kits/ToolbarKit";
import {TypographyKit} from "./kits/TypographyKit";
import {SaasTemplate} from "./saas/AdminConsole";
import "./templates.css";
import "./scenarios.css";
import "./kits/kits.css";

const views: Record<string, ComponentType> = {
  dashboard: DashboardTemplate,
  mail: MailTemplate,
  chat: ChatTemplate,
  crm: CrmTemplate,
  finances: FinancesTemplate,
  "ai-assistant": AIChatWorkspace,
  saas: SaasTemplate,
  "kit-sidebar": SidebarKit,
  "kit-auth": AuthKit,
  "kit-responsive": ResponsiveKit,
  "kit-agent": AgentKit,
  "kit-banner": BannerKit,
  "kit-toolbar": ToolbarKit,
  "kit-type": TypographyKit,
};

type Entry = (typeof templateSections)[number] | (typeof componentKits)[number];

/** One template or kit: the live component and its source, switched from the tabs on the right. */
function Block({item}: {item: Entry}) {
  const text = useText();
  const locale = useLocale();
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [codeSeen, setCodeSeen] = useState(false);
  const View = views[item.id]!;
  const titleId = `templates-${item.id}-title`;

  return <section id={`templates-${item.id}`} className="templates__section" aria-labelledby={titleId}>
    <Tabs className="tpl-block" selectedKey={tab} onSelectionChange={(key) => { const next = key === "code" ? "code" : "preview"; setTab(next); if (next === "code") setCodeSeen(true); }}>
      <div className="tpl-block__head">
        <div className="templates__head">
          <h3 id={titleId}>{text(item.en, item.zh)}{locale === "zh-CN" && <span>{item.en}</span>}</h3>
          <p>{text(item.description.en, item.description.zh)}</p>
          <ul className="templates__uses" aria-label={text("Components used", "使用的组件")}>{item.uses.map((use) => <li key={use}>{use}</li>)}</ul>
        </div>
        <Tabs.ListContainer className="tpl-block__switch">
          <Tabs.List aria-label={text(`${item.en}: view`, `${item.zh}：视图`)}>
            <Tabs.Tab id="preview"><Eye aria-hidden="true" width={14} height={14} />{text("Preview", "组件")}<Tabs.Indicator /></Tabs.Tab>
            <Tabs.Tab id="code"><Code aria-hidden="true" width={14} height={14} />{text("Code", "源码")}<Tabs.Indicator /></Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
      </div>
      {/* The preview stays mounted so switching to code and back keeps its state. */}
      <Tabs.Panel id="preview" shouldForceMount className="tpl-block__panel">
        <div className={`tpl-frame tpl-frame--${item.id}`}><View /></div>
      </Tabs.Panel>
      <Tabs.Panel id="code" shouldForceMount className="tpl-block__panel">
        {codeSeen && <SourceView sources={item.sources} />}
      </Tabs.Panel>
    </Tabs>
  </section>;
}

function Templates({section}: {section: string}) {
  const text = useText();
  useEffect(() => {
    const frame = requestAnimationFrame(() => scrollToSection("templates", section));
    return () => cancelAnimationFrame(frame);
  }, [section]);

  return <div className="templates">
    <header className="templates__intro">
      <h1>{text("Templates", "模板")}</h1>
      <p>{text("Combine components freely, and Niltavi UI comes together naturally and in harmony.", "自由组合各类组件，Niltavi UI 天然可以形成自然和谐的效果。")}</p>
    </header>
    <div className="templates__group" aria-labelledby="templates-library-title">
      <header className="templates__group-head">
        <h2 id="templates-library-title">{text("Template library", "模板库")}</h2>
        <p>{text("Complete scenarios for demos and as a base for a new product.", "完整的场景组合，适合演示，也可以作为新产品的底子。")}</p>
      </header>
      {templateSections.map((item) => <Block key={item.id} item={item} />)}
    </div>
    <div className="templates__group" aria-labelledby="templates-kits-title">
      <header className="templates__group-head">
        <h2 id="templates-kits-title">{text("Component kits", "组件套装")}</h2>
        <p>{text("Self-contained building blocks. Copy the source and wire in your own data.", "独立可用的积木。复制源码，接上自己的数据即可。")}</p>
      </header>
      {componentKits.map((item) => <Block key={item.id} item={item} />)}
    </div>
  </div>;
}

export default memo(Templates);
