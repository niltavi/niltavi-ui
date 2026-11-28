import {Check, Copy} from "@gravity-ui/icons";
import {Button, Link, Typography, toast} from "@heroui/react";
import {useEffect, useState, type ReactNode} from "react";
import skillSource from "../../skills/niltavi-ui/SKILL.md?raw";
import {useText} from "./Locale";
import {sectionId} from "./navigation";
import {examplePrompts, installPrompt, invocations, readSkillVersion, repoUrl, skillName} from "./skillsContent";

const skillVersion = readSkillVersion(skillSource);

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

function CodeBlock({code, label, wrap = false}: {code: string; label: string; wrap?: boolean}) {
  const text = useText();
  const copyText = useCopyText();
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);
  return <div className={wrap ? "code-block code-block--wrap" : "code-block"}>
    <pre aria-label={label}><code>{code}</code></pre>
    <Button isIconOnly size="sm" variant="ghost" className="code-block__copy" aria-label={text(`Copy ${label}`, `复制${label}`)}
      onPress={async () => setCopied(await copyText(code, text("Copied", "已复制")))}>
      {copied ? <Check aria-hidden="true" width={16} height={16} /> : <Copy aria-hidden="true" width={16} height={16} />}
    </Button>
  </div>;
}

function Section({id, title, children}: {id: string; title: string; children: ReactNode}) {
  const anchor = sectionId("skills", id);
  return <section id={anchor} className="editorial-section skills-section" aria-labelledby={`${anchor}-title`}>
    <Typography.Heading level={2} id={`${anchor}-title`}>{title}</Typography.Heading>
    {children}
  </section>;
}

export default function Skills() {
  const text = useText();

  return <article className="editorial-page skills-page" aria-labelledby="skills-title">
    <header className="editorial-header">
      <Typography.Heading id="skills-title" level={1}>Skills</Typography.Heading>
      <Typography.Paragraph color="muted">{text(
        "Teach your coding assistant to build UI in the Niltavi style.",
        "让编程助手按 Niltavi 的风格写界面。",
      )}</Typography.Paragraph>
    </header>

    <div className="editorial-sections">
      <Section id="installation" title={text("Installation", "安装")}>
        <Typography.Paragraph>{text(
          "Copy this prompt and send it to your coding assistant. It will install the skill for you.",
          "复制下面这段话发给你的编程助手，它会帮你装好。",
        )}</Typography.Paragraph>
        <CodeBlock code={text(installPrompt.en, installPrompt.zh)} label={text("install prompt", "安装提示词")} wrap />
        <Typography.Paragraph color="muted">
          {skillVersion && <>{text("Version ", "版本 ")}{skillVersion}{" · "}</>}
          {text("Source: ", "源文件：")}<Link href={`${repoUrl}/tree/main/skills/${skillName}`} target="_blank" rel="noopener noreferrer">skills/{skillName}</Link>
        </Typography.Paragraph>
      </Section>

      <Section id="usage" title={text("Usage", "调用")}>
        <Typography.Paragraph>{text(
          "Once it's installed, your assistant uses it whenever you ask for UI work. You can also call it by name:",
          "装好以后，你让助手做界面，它会自己用上。也可以点名让它用：",
        )}</Typography.Paragraph>
        <dl className="skills-paths">
          {invocations.map((item) => <div key={item.agent}><dt>{item.agent}</dt><dd><code>{item.command}</code></dd></div>)}
          <div><dt>{text("Other assistants", "其他助手")}</dt><dd>{text("Mention niltavi-ui in your request.", "在请求里提到 niltavi-ui。")}</dd></div>
        </dl>
        <Typography.Paragraph>{text("Try asking:", "可以这样提问：")}</Typography.Paragraph>
        <div className="skills-prompts">
          {examplePrompts.map((prompt) => <CodeBlock key={prompt.en} code={text(prompt.en, prompt.zh)} label={text("example prompt", "示例提问")} wrap />)}
        </div>
      </Section>
    </div>
  </article>;
}
