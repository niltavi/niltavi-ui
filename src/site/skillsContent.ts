// Display copy for the Skills page. The agent-facing rules live in skills/niltavi-ui/SKILL.md.
type Copy = {en: string; zh: string};

export const skillName = "niltavi-ui";
export const siteUrl = "https://ui.niltavi.com/";
export const repoUrl = "https://github.com/niltavi/niltavi-ui";

export function readSkillVersion(source: string) {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  return frontmatter?.match(/^metadata:\r?\n(?: {2}[^\r\n]*\r?\n)*? {2}version: "([^"\r\n]+)"\r?$/m)?.[1];
}

/** A prompt the reader pastes into their coding assistant so it installs the skill for them. */
export const installPrompt: Copy = {
  en: `Install the niltavi-ui skill into this project.

Run: npx skills add niltavi/niltavi-ui --skill niltavi-ui

If that doesn't work, download the skills/niltavi-ui folder from ${repoUrl} and put it where you keep your skills (usually .claude/skills/ or .agents/skills/).

When you're done, tell me where it was installed.`,
  zh: `请把 niltavi-ui Skill 安装到当前项目。

运行：npx skills add niltavi/niltavi-ui --skill niltavi-ui

如果命令不可用，就去 ${repoUrl} 把 skills/niltavi-ui 这个文件夹下载下来，放到你平时放 Skill 的地方（一般是 .claude/skills/ 或 .agents/skills/）。

完成后告诉我安装在哪里。`,
};

export const invocations = [
  {agent: "Claude Code", command: "/niltavi-ui"},
  {agent: "Codex", command: "$niltavi-ui"},
];

export const examplePrompts: Copy[] = [
  {en: "/niltavi-ui Make me a sign-up page.", zh: "/niltavi-ui 帮我做一个注册页。"},
  {en: "/niltavi-ui Make this page look like Niltavi.", zh: "/niltavi-ui 把这个页面改成 Niltavi 的风格。"},
  {en: "/niltavi-ui Add a dark mode to the settings page.", zh: "/niltavi-ui 给设置页加上深色模式。"},
];

export const skillSections: {id: string; title: Copy}[] = [
  {id: "installation", title: {en: "Installation", zh: "安装"}},
  {id: "usage", title: {en: "Usage", zh: "调用"}},
];
