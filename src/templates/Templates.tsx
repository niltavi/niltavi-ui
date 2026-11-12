import {memo, useEffect, type ComponentType} from "react";
import {useLocale, useText} from "../site/Locale";
import {scrollToSection} from "../site/navigation";
import {templateSections} from "./catalog";
import ChatTemplate from "./Chat";
import CrmTemplate from "./Crm";
import DashboardTemplate from "./Dashboard";
import FinancesTemplate from "./Finances";
import MailTemplate from "./Mail";
import {AIChatWorkspace} from "./ai/AIChatWorkspace";
import {AIWidget} from "./ai/AIWidget";
import {SaasTemplate} from "./saas/AdminConsole";
import "./templates.css";
import "./scenarios.css";

const views: Record<string, ComponentType> = {
  dashboard: DashboardTemplate,
  mail: MailTemplate,
  chat: ChatTemplate,
  crm: CrmTemplate,
  finances: FinancesTemplate,
  "ai-assistant": AIChatWorkspace,
  saas: SaasTemplate,
};

function Templates({section}: {section: string}) {
  const text = useText();
  const locale = useLocale();
  useEffect(() => {
    const frame = requestAnimationFrame(() => scrollToSection("templates", section));
    return () => cancelAnimationFrame(frame);
  }, [section]);

  return <div className="templates">
    <header className="templates__intro">
      <h1>{text("Templates", "模板")}</h1>
      <p>{text("Common business scenarios assembled from Niltavi components and icons: an AI assistant, dashboards, communication, sales, finance and a complete SaaS console. Each one is a working starting point, not a sketch.", "用 Niltavi 组件与图标拼装的常见业务场景：AI 助手、仪表盘、沟通、销售、财务，以及一套完整的 SaaS 后台。每一套都可以直接跑起来，作为项目的起点。")}</p>
    </header>
    {templateSections.map((item) => {
      const View = views[item.id];
      return <section key={item.id} id={`templates-${item.id}`} className="templates__section" aria-labelledby={`templates-${item.id}-title`}>
        <div className="templates__head">
          <h2 id={`templates-${item.id}-title`}>{text(item.en, item.zh)}{locale === "zh-CN" && <span>{item.en}</span>}</h2>
          <p>{text(item.description.en, item.description.zh)}</p>
          <ul className="templates__uses" aria-label={text("Components used", "使用的组件")}>{item.uses.map((use) => <li key={use}>{use}</li>)}</ul>
        </div>
        <div className={`tpl-frame tpl-frame--${item.id}`}><View /></div>
      </section>;
    })}
    <AIWidget />
  </div>;
}

export default memo(Templates);
