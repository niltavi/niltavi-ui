import {Typography} from "@heroui/react";
import birdArtwork from "../../docs/assets/niltavi-bird.svg";
import {useText} from "./Locale";
import {editorialContent} from "./editorialContent";
// Single motifs from niltavi-banner (MIT, commit 733b9bc), one per print style.
import screenprintArt from "./motifs/screenprint-sprig-islet.png";
import stampArt from "./motifs/stamp-kingfisher.png";
import woodcutArt from "./motifs/woodcut-fir.png";

const motifArt = {screenprint: screenprintArt, stamp: stampArt, woodcut: woodcutArt};
import {sectionId} from "./navigation";

export default function Editorial({page}: {page: "philosophy"}) {
  const text = useText();
  const content = editorialContent[page];

  return <article className={`editorial-page editorial-page--${page}`} aria-labelledby="editorial-title">
    <header className="editorial-header">
      <Typography.Heading id="editorial-title" level={1}>{content.title ? text(content.title.en, content.title.zh) : text("Philosophy", "理念")}</Typography.Heading>
      {content.lead && <Typography.Paragraph className="editorial-lead">{text(content.lead.en, content.lead.zh)}</Typography.Paragraph>}
    </header>
    <div className="editorial-sections">
      {content.sections.map((item) => {
        const id = sectionId(page, item.id);
        const body = <>
          <Typography.Heading level={2} id={`${id}-title`}>{text(item.title.en, item.title.zh)}</Typography.Heading>
          {item.id === "color" && <img className="editorial-bird" src={birdArtwork} width={1030} height={1380} alt={text("A blue and yellow niltava resting on a branch", "栖在枝头的蓝黄色仙鹟")} />}
          {item.paragraphs.map((block, index) => "list" in block
            ? <ul key={index} className="editorial-list">{block.list.map((entry) => <li key={entry.en}>{text(entry.en, entry.zh)}</li>)}</ul>
            : "motifs" in block
              ? <div key={index} className="editorial-motifs" aria-hidden="true">{block.motifs.map((motif) =>
                  <span key={motif.style} className={`editorial-motif editorial-motif--${motif.style}`} style={{maskImage: `url(${motifArt[motif.style]})`, WebkitMaskImage: `url(${motifArt[motif.style]})`}} />)}</div>
              : <Typography.Paragraph key={index}>{text(block.en, block.zh)}</Typography.Paragraph>)}
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
