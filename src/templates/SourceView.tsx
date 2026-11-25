import {Check, Copy} from "@gravity-ui/icons";
import {Button, Spinner, Tabs, toast} from "@heroui/react";
import {useEffect, useMemo, useState} from "react";
import {useLocale, useText} from "../site/Locale";
import {localizeSource} from "./sourceLocale";

// Raw sources load on demand, so the preview never pays for the code view.
const files = import.meta.glob<string>(["./**/*.tsx", "./**/*.ts", "./**/*.css", "./saas/vendor/**/*.js"], {query: "?raw", import: "default"});

const marker = /^\/\* -{10} (.+?) -{10} \*\/$/;

/** `file#Section` keeps the file's header (imports, types) plus one marked block. */
export function excerpt(source: string, section?: string) {
  if (!section) return source;
  const lines = source.split("\n");
  const start = lines.findIndex((line) => marker.exec(line.trim())?.[1] === section);
  if (start < 0) return source;
  const next = lines.findIndex((line, index) => index > start && marker.test(line.trim()));
  const block = lines.slice(start, next < 0 ? undefined : next).join("\n").trimEnd();
  const firstMarker = lines.findIndex((line) => marker.test(line.trim()));
  const header = firstMarker > 0 ? lines.slice(0, firstMarker).join("\n").trim() : "";
  return header && !header.startsWith("/*") ? `${header}\n\n${block}\n` : `${block}\n`;
}

async function load(path: string) {
  const [file, section] = path.split("#");
  const loader = files[`./${file}`];
  if (!loader) throw new Error(`Missing source: ${file}`);
  return excerpt(await loader(), section);
}

function label(path: string) {
  const [file, section] = path.split("#");
  const name = file!.split("/").pop()!;
  return section ? `${name} · ${section}` : name;
}

function CodeFile({path}: {path: string}) {
  const text = useText();
  const locale = useLocale();
  const [raw, setRaw] = useState<string | null>(null);
  // The code reads in the page language, matching the rendered component.
  const code = useMemo(() => raw && localizeSource(raw, locale), [raw, locale]);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    let live = true;
    load(path).then((value) => { if (live) setRaw(value); }, () => { if (live) setRaw(""); });
    return () => { live = false; };
  }, [path]);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      toast.success(text("Copied", "已复制"));
      setCopied(true);
    } catch {
      toast.danger(text("Could not copy. Select the text and copy it manually.", "复制失败，请选中文字后手动复制。"));
    }
  };

  return <div className="tpl-code__file">
    <div className="tpl-code__bar">
      <code className="tpl-code__path">src/templates/{path.split("#")[0]}</code>
      <Button size="sm" variant="ghost" onPress={copy} isDisabled={!code}>
        {copied ? <Check aria-hidden="true" width={14} height={14} /> : <Copy aria-hidden="true" width={14} height={14} />}
        {copied ? text("Copied", "已复制") : text("Copy", "复制")}
      </Button>
    </div>
    {raw === null
      ? <div className="tpl-code__loading"><Spinner size="sm" /></div>
      : <pre className="tpl-code__pre" tabIndex={0} aria-label={label(path)}><code>{code || text("Source unavailable.", "源码暂不可用。")}</code></pre>}
  </div>;
}

/** Source files behind one template or kit, one tab per file. */
export function SourceView({sources}: {sources: readonly string[]}) {
  const text = useText();
  if (sources.length === 1) return <div className="tpl-code"><CodeFile path={sources[0]!} /></div>;
  return <Tabs className="tpl-code" variant="secondary">
    <Tabs.ListContainer>
      <Tabs.List aria-label={text("Source files", "源码文件")}>
        {sources.map((path) => <Tabs.Tab key={path} id={path}>{label(path)}<Tabs.Indicator /></Tabs.Tab>)}
      </Tabs.List>
    </Tabs.ListContainer>
    {sources.map((path) => <Tabs.Panel key={path} id={path} className="tpl-code__panel"><CodeFile path={path} /></Tabs.Panel>)}
  </Tabs>;
}
