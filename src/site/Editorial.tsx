import {Copy} from "@gravity-ui/icons";
import {Button, Link, Surface, Typography, toast} from "@heroui/react";
import {useEffect} from "react";
import {useLocale, useText} from "./Locale";
import {editorialContent, formatPrompt} from "./editorialContent";
import {scrollToSection, sectionId} from "./navigation";

export default function Editorial({page, section}: {page: "philosophy" | "prompts"; section: string}) {
  const text = useText();
  const locale = useLocale();
  const content = editorialContent[page];
  useEffect(() => {
    const frame = requestAnimationFrame(() => scrollToSection(page, section));
    return () => cancelAnimationFrame(frame);
  }, [page, section]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(formatPrompt(locale));
      toast.success(text("Prompt copied", "已复制完整提示词"));
    } catch {
      toast.danger(text("Could not copy. Select the text and copy it manually.", "复制失败，请选中文字后手动复制。"));
    }
  };

  return <article className="editorial-page" aria-labelledby="editorial-title">
    <header className="editorial-header">
      <Typography.Heading id="editorial-title" level={1}>{page === "philosophy" ? text("Philosophy", "理念") : text("Prompts", "提示词")}</Typography.Heading>
      {page === "prompts" && <>
        <Typography.Paragraph color="muted">{text("A visual language for the work you make. Copy these directions into your design or coding assistant.", "将这份视觉设计提示词复制给设计或编程助手，用于网页、组件与插画创作。")}</Typography.Paragraph>
        <Button variant="secondary" onPress={copy}><Copy width={16} height={16} />{text("Copy full prompt", "复制完整提示词")}</Button>
      </>}
    </header>
    <div className="editorial-sections">
      {content.sections.map((item, index) => {
        const id = sectionId(page, item.id);
        const body = <>
          <Typography.Heading level={2} id={`${id}-title`}>{text(item.title.en, item.title.zh)}</Typography.Heading>
          {item.paragraphs.map((paragraph, paragraphIndex) => <Typography.Paragraph key={paragraphIndex}>{text(paragraph.en, paragraph.zh)}</Typography.Paragraph>)}
          {item.quote && <blockquote className="editorial-quote">{text(item.quote.en, item.quote.zh)}</blockquote>}
        </>;
        return <section key={item.id} id={id} className="editorial-section" aria-labelledby={`${id}-title`}>
          {page === "prompts" && index === 0 ? <Surface className="editorial-intro">{body}</Surface> : body}
        </section>;
      })}
    </div>
    {content.closing && <blockquote className="editorial-quote">{text(content.closing.en, content.closing.zh)}</blockquote>}
    <div className="editorial-source"><Link href={content.source} target="_blank" rel="noopener noreferrer">{text("Read the original on Notion", "阅读 Notion 原文")}<Link.Icon /></Link></div>
  </article>;
}
