import {Check, Copy, LogoGithub} from "@gravity-ui/icons";
import {Alert, Button, Link, Surface, Tabs, Typography, toast} from "@heroui/react";
import {buttonVariants} from "@heroui/styles";
import {useEffect, useState, type ReactNode} from "react";
import {Link as ButtonLink} from "react-aria-components";
import skillSource from "../../skills/niltavi-ui/SKILL.md?raw";
import {useText} from "./Locale";
import {scrollToSection, sectionId} from "./navigation";
import {agentDirectories, conventions, examplePrompts, installCommands, invocations, repoUrl, siteUrl, skillName, skillTree} from "./skillsContent";

function useCopyText() {
  const text = useText();
  return async (value: string, success: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(success);
      return true;
    } catch {
      toast.danger(text("Could not copy. Select the text and copy it manually.", "复制失败，请选中文字后手动复制。"));
      return false;
    }
  };
}

function CodeBlock({code, label}: {code: string; label: string}) {
  const text = useText();
  const copyText = useCopyText();
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);
  return <div className="code-block">
    <pre aria-label={label}><code>{code}</code></pre>
    <Button isIconOnly size="sm" variant="ghost" className="code-block__copy" aria-label={text(`Copy ${label}`, `复制${label}`)}
      onPress={async () => setCopied(await copyText(code, text("Copied", "已复制")))}>
      {copied ? <Check aria-hidden="true" width={16} height={16} /> : <Copy aria-hidden="true" width={16} height={16} />}
    </Button>
  </div>;
}

/** Rule copy marks tokens, classes, and paths with backticks. */
function InlineCode({value}: {value: string}) {
  return <>{value.split(/(`[^`]+`)/).map((part, index) => part.startsWith("`") ? <code key={index}>{part.slice(1, -1)}</code> : part)}</>;
}

function Section({id, title, children}: {id: string; title: string; children: ReactNode}) {
  const anchor = sectionId("skills", id);
  return <section id={anchor} className="editorial-section skills-section" aria-labelledby={`${anchor}-title`}>
    <Typography.Heading level={2} id={`${anchor}-title`}>{title}</Typography.Heading>
    {children}
  </section>;
}

export default function Skills({section}: {section: string}) {
  const text = useText();
  const copyText = useCopyText();
  useEffect(() => {
    const frame = requestAnimationFrame(() => scrollToSection("skills", section));
    return () => cancelAnimationFrame(frame);
  }, [section]);

  return <article className="editorial-page skills-page" aria-labelledby="skills-title">
    <header className="editorial-header">
      <Typography.Heading id="skills-title" level={1}>Skills</Typography.Heading>
      <Typography.Paragraph color="muted">{text(
        "Give your coding assistant the Niltavi visual language: tokens, components, and the judgment between them.",
        "让编程助手掌握 Niltavi 的视觉语言：Token、组件，以及两者之间的分寸。",
      )}</Typography.Paragraph>
      <div className="skills-actions">
        <Button variant="secondary" onPress={() => copyText(skillSource, text("SKILL.md copied", "已复制 SKILL.md"))}><Copy aria-hidden="true" width={16} height={16} />{text("Copy SKILL.md", "复制 SKILL.md")}</Button>
        <ButtonLink className={buttonVariants({variant: "ghost"})} href={`${repoUrl}/tree/main/skills/${skillName}`} target="_blank" rel="noopener noreferrer"><LogoGithub aria-hidden="true" width={16} height={16} />{text("View source", "查看源文件")}</ButtonLink>
      </div>
    </header>

    <div className="editorial-sections">
      <section id={sectionId("skills", "overview")} className="editorial-section" aria-labelledby="skills-overview-title">
        <Surface className="editorial-intro">
          <Typography.Heading level={2} id="skills-overview-title">{text("Let the assistant learn the forest first", "先让助手读懂这片森林")}</Typography.Heading>
          <Typography.Paragraph>{text(
            "A design language lives in small decisions: which blue means go, how much space a paragraph needs, when to stop adding. People learn this by looking for a long time. An assistant needs it written down.",
            "一种设计语言藏在许多细小的决定里：哪一种蓝意味着前进，一段文字需要多少留白，什么时候应该停止添加。人靠长久地观看去体会这些，助手则需要有人把它写下来。",
          )}</Typography.Paragraph>
          <Typography.Paragraph>{text(
            "The niltavi-ui skill turns that intent into frontend rules your assistant can follow: semantic tokens instead of hex values, HeroUI v3 composition instead of new widgets, a 1px ring instead of a drop shadow, and checks for dark mode, small screens, keyboard, and contrast before hand-off.",
            "niltavi-ui Skill 把这些意图翻译成助手能执行的前端约定：用语义 Token 代替色值，用 HeroUI v3 组合代替重写控件，用 1px 描边代替投影，并在交付前检查深色模式、小屏、键盘操作与对比度。",
          )}</Typography.Paragraph>
        </Surface>
      </section>

      <Section id="installation" title={text("Installation", "安装")}>
        <Typography.Paragraph>{text("Install with the skills CLI. It detects your assistants and writes the skill into the project.", "用 skills CLI 安装。它会识别本机的编程助手，把 Skill 写入当前项目。")}</Typography.Paragraph>
        <Tabs className="skills-tabs">
          <Tabs.ListContainer>
            <Tabs.List aria-label={text("Install method", "安装方式")}>
              <Tabs.Tab id="project">{text("Project", "当前项目")}<Tabs.Indicator /></Tabs.Tab>
              <Tabs.Tab id="global">{text("Global", "全局")}<Tabs.Indicator /></Tabs.Tab>
              <Tabs.Tab id="manual">{text("Manual", "手动")}<Tabs.Indicator /></Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
          <Tabs.Panel id="project"><CodeBlock code={installCommands.project} label={text("install command", "安装命令")} /></Tabs.Panel>
          <Tabs.Panel id="global"><CodeBlock code={installCommands.global} label={text("install command", "安装命令")} /></Tabs.Panel>
          <Tabs.Panel id="manual"><CodeBlock code={installCommands.manual} label={text("install commands", "安装命令")} /></Tabs.Panel>
        </Tabs>
        <Typography.Paragraph>{text(
          "Project scope keeps the skill out of repositories that don't use Niltavi. Each assistant reads from its own folder:",
          "安装到项目，可以避免在不使用 Niltavi 的仓库里占用助手的上下文。各助手读取的目录如下：",
        )}</Typography.Paragraph>
        <dl className="skills-paths">
          {agentDirectories.map((item) => <div key={item.agent}><dt>{item.agent}</dt><dd><code>{item.path}</code></dd></div>)}
        </dl>
      </Section>

      <Section id="usage" title={text("Usage", "调用")}>
        <Typography.Paragraph>{text(
          "Assistants load the skill on their own when a task touches UI in a Niltavi project. To call it explicitly:",
          "在 Niltavi 项目里处理界面相关任务时，助手会自动加载这个 Skill。也可以直接调用：",
        )}</Typography.Paragraph>
        <dl className="skills-paths">
          {invocations.map((item) => <div key={item.agent}><dt>{item.agent}</dt><dd><code>{item.command}</code></dd></div>)}
          <div><dt>{text("Other assistants", "其他助手")}</dt><dd>{text("Mention niltavi-ui in your request.", "在请求里提到 niltavi-ui。")}</dd></div>
        </dl>
        <Typography.Paragraph>{text("Try asking:", "可以这样提问：")}</Typography.Paragraph>
        <div className="skills-prompts">
          {examplePrompts.map((prompt) => <CodeBlock key={prompt.en} code={text(prompt.en, prompt.zh)} label={text("example prompt", "示例提问")} />)}
        </div>
      </Section>

      <Section id="source" title={text("Follow the latest conventions", "以最新约定为准")}>
        <Alert status="accent">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{text("The repository is the source of truth", "仓库是唯一的事实来源")}</Alert.Title>
            <Alert.Description>{text(
              "The skill tells your assistant to read the current theme files before writing UI. When the skill text and the repository disagree, the latest repository and live site win.",
              "Skill 会要求助手在写界面之前先读取当前的主题文件。Skill 文本与仓库不一致时，以仓库和线上站点的最新版本为准。",
            )}</Alert.Description>
          </Alert.Content>
        </Alert>
        <ul className="skills-rules">
          <li><Link href={siteUrl} target="_blank" rel="noopener noreferrer">ui.niltavi.com</Link>{text(": live components, palette, and contrast tables.", "：组件、色卡与对比度表的线上参考。")}</li>
          <li><Link href={repoUrl} target="_blank" rel="noopener noreferrer">github.com/niltavi/niltavi-ui</Link>{text(": theme CSS, DTCG tokens, and example compositions on main.", "：main 分支上的主题 CSS、DTCG Token 与组件示例。")}</li>
          <li>{text("Never invent a token, variant, or color the repository doesn't define.", "不要创造仓库里没有定义的 Token、变体或颜色。")}</li>
        </ul>
      </Section>

      {conventions.map((item) => <Section key={item.id} id={item.id} title={text(item.title.en, item.title.zh)}>
        <p className="skills-lead">{text(item.lead.en, item.lead.zh)}</p>
        <ul className="skills-rules">
          {item.rules.map((rule) => <li key={rule.en}><InlineCode value={text(rule.en, rule.zh)} /></li>)}
        </ul>
      </Section>)}

      <Section id="structure" title={text("Structure", "目录结构")}>
        <Typography.Paragraph>{text(
          "One file, written for assistants in English. It points to the theme files instead of copying them, so it stays current.",
          "只有一个文件，用英文写给助手。它指向主题文件而不复制其中的值，因此不会过期。",
        )}</Typography.Paragraph>
        <CodeBlock code={skillTree} label={text("file tree", "目录结构")} />
      </Section>
    </div>
  </article>;
}
