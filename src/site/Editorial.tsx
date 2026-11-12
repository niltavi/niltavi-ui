import {Typography} from "@heroui/react";
import {useEffect} from "react";
import birdArtwork from "../../docs/assets/niltavi-bird.svg";
import {useText} from "./Locale";
import {editorialContent} from "./editorialContent";
import {scrollToSection, sectionId} from "./navigation";

export default function Editorial({page, section}: {page: "philosophy"; section: string}) {
  const text = useText();
  const content = editorialContent[page];
  useEffect(() => {
    const frame = requestAnimationFrame(() => scrollToSection(page, section));
    return () => cancelAnimationFrame(frame);
  }, [page, section]);

  return <article className="editorial-page" aria-labelledby="editorial-title">
    <header className="editorial-header">
      <Typography.Heading id="editorial-title" level={1}>{text("Philosophy", "理念")}</Typography.Heading>
    </header>
    <div className="editorial-sections">
      {content.sections.map((item) => {
        const id = sectionId(page, item.id);
        const body = <>
          <Typography.Heading level={2} id={`${id}-title`}>{text(item.title.en, item.title.zh)}</Typography.Heading>
          {item.id === "color" && <img className="editorial-bird" src={birdArtwork} width={1030} height={1380} alt={text("A blue and yellow niltava resting on a branch", "栖在枝头的蓝黄色仙鹟")} />}
          {item.paragraphs.map((paragraph, paragraphIndex) => <Typography.Paragraph key={paragraphIndex}>{text(paragraph.en, paragraph.zh)}</Typography.Paragraph>)}
          {item.quote && <blockquote className="editorial-quote">{text(item.quote.en, item.quote.zh)}</blockquote>}
        </>;
        return <section key={item.id} id={id} className="editorial-section" aria-labelledby={`${id}-title`}>
          {body}
        </section>;
      })}
    </div>
    {content.closing && <blockquote className="editorial-quote">{text(content.closing.en, content.closing.zh)}</blockquote>}
  </article>;
}
