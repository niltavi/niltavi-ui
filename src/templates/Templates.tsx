import {memo, useEffect, type ComponentType} from "react";
import {useLocale, useText} from "../site/Locale";
import {scrollToSection} from "../site/navigation";
import {templateSections} from "./catalog";
import ChatTemplate from "./Chat";
import CrmTemplate from "./Crm";
import DashboardTemplate from "./Dashboard";
import FinancesTemplate from "./Finances";
import MailTemplate from "./Mail";
import "./templates.css";

const views: Record<string, ComponentType> = {
  dashboard: DashboardTemplate,
  mail: MailTemplate,
  chat: ChatTemplate,
  crm: CrmTemplate,
  finances: FinancesTemplate,
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
      <p>{text("Complete application layouts assembled from Niltavi components and icons. Use them as starting points for dashboards, back offices and internal tools.", "用 Niltavi 组件与图标拼装的完整应用布局，可作为仪表盘、后台和内部工具的起点。")}</p>
    </header>
    {templateSections.map((item) => {
      const View = views[item.id];
      return <section key={item.id} id={`templates-${item.id}`} className="templates__section" aria-labelledby={`templates-${item.id}-title`}>
        <div className="templates__head">
          <h2 id={`templates-${item.id}-title`}>{text(item.en, item.zh)}{locale === "zh-CN" && <span>{item.en}</span>}</h2>
          <p>{text(item.description.en, item.description.zh)}</p>
          <ul className="templates__uses" aria-label={text("Components used", "使用的组件")}>{item.uses.map((use) => <li key={use}>{use}</li>)}</ul>
        </div>
        <div className="tpl-frame"><View /></div>
      </section>;
    })}
  </div>;
}

export default memo(Templates);
