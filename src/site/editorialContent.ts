// Adapted from the two Niltavi Notion essays; source links record content provenance.
type Copy = {en: string; zh: string};
type EditorialSection = {id: string; title: Copy; paragraphs: Copy[]; quote?: Copy};
type EditorialContent = {source: string; sections: EditorialSection[]; closing?: Copy};

export const philosophy: EditorialContent = {
  source: "https://app.notion.com/p/40e44fed5856810b8272effb59207522",
  sections: [
    {
      id: "naturalism",
      title: {en: "Naturalism in the Digital Age", zh: "数字时代的自然主义"},
      paragraphs: [{
        zh: "在人工智能不断拓展人类能力边界的时代，我们希望重新唤起人们对自然、感知与自我体验的关注。技术让世界变得更加高效、精确和丰富，而自然提醒我们，生活中仍有许多值得亲自感受的事物：一束穿过树叶的阳光、一阵微风、一只偶然停留在枝头的鸟，以及那些无法被预先计算的细微瞬间。",
        en: "As artificial intelligence carries human possibility ever further, we hope to bring our attention home: to nature, to the senses, to the quiet fact of being here. Technology makes the world more efficient, more precise, more abundant. Nature reminds us how much still asks to be felt firsthand: sunlight sifting through leaves, a passing breeze, a bird alighting on a branch, the small, unbidden moments no calculation can foretell.",
      }],
    },
    {
      id: "color",
      title: {en: "Color, from the forest", zh: "色彩，来自森林"},
      paragraphs: [{
        zh: "Niltavi 的灵感来自栖息于森林中的仙鹟。它拥有鲜明而纯净的蓝色羽毛，点缀着温暖的黄色，在深邃的森林绿意之间呈现出一种安静而生动的美。这种色彩关系构成了我们的视觉起点：以蓝色表达自由、清澈与探索，以黄色传递温度、生命力与偶然的惊喜，以森林绿承载自然的深度、宁静与归属感。我们将这些源于自然的颜色转化为克制、柔和而富有层次的视觉语言，让鲜明的生命色彩在低饱和的环境中自然浮现。",
        en: "Niltavi takes its inspiration from the niltava, a bird of the forest. Clear blue plumage, touched with warm yellow, holds a quiet, living beauty against the depth of green. Here our visual language begins: blue for freedom, clarity, and the urge to explore; yellow for warmth, vitality, and the grace of a chance encounter; forest green for stillness, depth, and a sense of belonging. Drawn from nature, these colors become a language of softness, restraint, and subtle layers, allowing the bright colors of life to emerge from a muted world.",
      }],
    },
    {
      id: "form",
      title: {en: "The line and the living world", zh: "刻线与生命"},
      paragraphs: [{
        zh: "在表现形式上，我们从传统自然博物图鉴与木刻版画中汲取灵感，并以现代平面矢量语言重新诠释。清晰的轮廓、纯粹的色块与简洁的几何构图，赋予画面现代设计的秩序与轻盈；羽毛、枝叶之间细腻而富有方向感的刻线，则保留了传统手工艺术的温度与生命感。我们珍视这种精确与自然之间的微妙平衡，让理性的数字形式承载感性的自然表达。",
        en: "We draw from old natural history plates and woodcut prints, giving them new expression in the language of flat vector illustration. Clear contours, unbroken fields of color, and simple geometry lend the image order and lightness. Fine cuts follow the grain of feathers, leaves, and branches, carrying the warmth of a hand at work. We cherish this delicate balance between precision and nature, where the measured forms of the digital world can hold the feeling of a living one.",
      }],
    },
    {
      id: "space",
      title: {en: "Room to linger", zh: "为感受留白"},
      paragraphs: [{
        zh: "我们相信，质感无需依赖繁复的装饰。温暖的纸张底色、舒展的留白、优雅的文字与克制的细节，足以营造一种安静而持久的美。画面中的每一种颜色、每一道线条、每一处空白，都应当拥有存在的理由。设计不急于吸引注意，也不试图填满所有空间，而是为观看、思考与感受留下余地。",
        en: "We believe beauty needs little ornament. The warmth of paper, generous open space, graceful type, and a few considered details are enough to make something quiet and enduring. Every color, every line, every interval of emptiness should earn its place. A design can wait for the eye to find it. It can leave room for looking, for thought, for feeling.",
      }],
    },
    {
      id: "rhythm",
      title: {en: "A rhythm of your own", zh: "保留自己的节奏"},
      paragraphs: [{
        zh: "Niltavi 所追求的是一种温和而清醒的现代自然主义。它拥抱技术带来的可能性，也珍视人类与真实世界之间不可替代的联系。我们希望通过一种轻盈、宁静、富有生命力的设计语言，邀请人们暂时放慢脚步，重新发现自然的细节，感受生活本身的丰富，并在不断变化的数字世界中，保留属于自己的节奏。",
        en: "Niltavi seeks a gentle, clear-eyed naturalism for our time. It welcomes the possibilities of technology and treasures the irreplaceable bond between people and the world they inhabit. Through a language of lightness, stillness, and life, we hope to offer an invitation: slow your steps, rediscover the small things growing around you, feel the abundance of being alive, and keep a rhythm of your own as the digital world moves on.",
      }],
      quote: {
        zh: "让技术拓展可能，让自然唤醒感知，让每一次真实的体验都值得被珍视。",
        en: "Let technology widen the possible.\nLet nature awaken the senses.\nLet every lived moment be cherished.",
      },
    },
    {
      id: "aesthetic",
      title: {en: "The heart of the aesthetic", zh: "核心审美"},
      quote: {
        zh: "鲜明的生命色彩，存在于宁静而克制的环境之中。",
        en: "The vivid colors of life,\nheld in a world of quiet restraint.",
      },
      paragraphs: [{
        zh: "蓝色的鸟是鲜活的视觉焦点；森林绿、米白与柔和的黄色建立安静的背景。木刻线条提供自然的温度，平面矢量保持数字时代的清晰感。整体气质是自然、宁静、清澈、温暖，带有诗意与探索世界的好奇心。",
        en: "A blue bird brings the image to life. Forest green, warm ivory, and soft yellow give it a quiet place to rest. Woodcut lines carry the warmth of nature; flat vector forms keep the clarity of the digital age. The feeling is natural, still, clear, and warm, with room for poetry and a curious eye turned toward the world.",
      }],
    },
  ],
};

export const prompts: EditorialContent = {
  source: "https://app.notion.com/p/40e44fed58568194bd4ed293835efa9b",
  sections: [
    {
      id: "direction",
      title: {en: "A natural history, newly drawn", zh: "现代自然博物图鉴"},
      paragraphs: [{
        zh: "以现代自然博物图鉴风格（Contemporary Natural History Editorial）完成设计，融合平面矢量插画、木刻版画语言与编辑式网页设计。让作品像一本被重新诠释的鸟类图鉴：安静、优雅、自然，带有文学气质。保持现代数字产品的清晰度、可读性与易用性，让精致感来自比例、构图、排版与细节的协调。",
        en: "Design in the spirit of Contemporary Natural History Editorial, bringing together flat vector illustration, the language of woodcut, and editorial web design. Let the work feel like a bird atlas imagined anew: quiet, graceful, close to nature, with a literary sensibility. Preserve the clarity, readability, and ease of a modern digital product. Let refinement arise from proportion, composition, typography, and the accord of small details.",
      }],
    },
    {
      id: "color",
      title: {en: "A palette gathered from nature", zh: "自然配色"},
      paragraphs: [{
        zh: "以温暖米白或奶油白铺底，深森林绿或墨绿承载主文字。插画使用低饱和的灰蓝、深蓝、植物绿、赭黄与少量金棕色；强调色只在必要处出现。优先继承项目现有的设计变量（Design Tokens），避免根据截图猜测、替换色值。",
        en: "Begin with warm ivory or cream, and set the main text in deep forest green or green-black ink. Give illustrations a muted palette of blue-gray, deep blue, botanical green, ochre, and a trace of golden brown. Let accents appear sparingly, where they have a purpose. Inherit the project's existing design tokens; avoid guessing or replacing colors from screenshots.",
      }],
    },
    {
      id: "illustration",
      title: {en: "Follow the feather, follow the leaf", zh: "插画与刻线"},
      paragraphs: [{
        zh: "保留鸟类与植物的准确形态，用清晰剪影、平整色块和简洁几何构图建立秩序。在羽毛、叶脉与枝条内部，加入少量顺着形体方向的浅色刻线和负空间。以刻线表达木刻的温度，避免用随机颗粒代替形体结构。",
        en: "Honor the true forms of birds and plants. Build order with clear silhouettes, flat fields of color, and simple geometry. Within feathers, leaf veins, and branches, place a few pale cuts and pockets of negative space that follow the form. Let the carved line carry the warmth of woodcut; random grain cannot stand in for structure.",
      }],
    },
    {
      id: "texture",
      title: {en: "The quiet of paper", zh: "纸张与纹理"},
      paragraphs: [{
        zh: "默认保持背景干净，省去全局噪点、颗粒与脏污纹理。需要纸感时，仅加入极少量、低对比的纸纤维或斑点，避免旧纸污渍、破损边缘和印刷错位。层次不足时，先调整形状、刻线、色块与构图。",
        en: "Keep the background clean by default, free of all-over noise, grain, or grunge. When the work calls for the feel of paper, use only a whisper of low-contrast fibers or flecks. Avoid aged stains, torn edges, and misregistered ink. If the image needs depth, first revisit its shapes, cuts, fields of color, and composition.",
      }],
    },
    {
      id: "typography",
      title: {en: "Type and breathing room", zh: "字体与留白"},
      paragraphs: [{
        zh: "以优雅的大型衬线标题带出文学与图鉴气质，导航、说明与按钮使用清晰的现代无衬线字体。让插画承担视觉主体，文字精炼，留出舒适的空白。细分隔线、短装饰线、简洁圆形背景和适度出血构图，可按内容需要使用。移动端仍需保持清晰的阅读顺序、视觉中心与可达的操作。",
        en: "Let generous, graceful serif headings recall the page of a literary atlas. Use clear, modern sans-serif type for navigation, descriptions, and buttons. Give illustration the visual lead, keep words considered and few, and leave space to breathe. Fine rules, short accent lines, simple circular backdrops, and gentle bleeds may serve the composition where needed. On small screens, preserve the reading order, visual focus, and reach of every control.",
      }],
    },
    {
      id: "interaction",
      title: {en: "A light touch", zh: "组件与动效"},
      paragraphs: [{
        zh: "复用现有按钮、卡片、表单与交互组件，保持轻量的表面、克制的边框和清晰的状态反馈。动效短暂、自然，并照顾性能与可访问性。交付前检查桌面与移动端的视觉层次、可读性、键盘操作和对比度。",
        en: "Reuse existing buttons, cards, forms, and interactive components. Keep surfaces light, borders restrained, and feedback clear. Let motion be brief and natural, with care for performance and accessibility. Before delivery, check hierarchy, readability, keyboard access, and contrast on both desktop and mobile.",
      }],
    },
    {
      id: "avoid",
      title: {en: "Keep the language clear", zh: "避免偏离"},
      paragraphs: [{
        zh: "避免霓虹渐变、玻璃拟态、发光按钮与模板化卡片；避免重度复古做旧、厚重木纹与密集交叉排线；避免儿童卡通、照片写实、3D 塑料材质、厚重阴影与过度动画。保持干净剪影、自然色彩、舒适留白与局部木刻细节，并与项目现有系统一致。",
        en: "Avoid neon gradients, glass effects, glowing buttons, and formulaic card layouts. Leave out heavy antiquing, dense wood grain, and crowded crosshatching; keep away from children's cartoons, photorealism, plastic 3D surfaces, heavy shadows, and excessive animation. Stay with clean silhouettes, natural colors, generous space, and a few woodcut details, in keeping with the project's existing system.",
      }],
    },
  ],
  closing: {
    zh: "让插画表达情绪，让排版建立秩序，让留白提供呼吸感。木刻是插画语言，现代编辑设计是页面语言。",
    en: "Let illustration carry feeling.\nLet typography lend order.\nLet open space give breath.\nWoodcut speaks through the image; modern editorial design shapes the page.",
  },
};

export const editorialContent = {philosophy, prompts};

/** The copied prompt is built from the same text the reader sees. */
export function formatPrompt(locale: "en" | "zh-CN") {
  const key = locale === "en" ? "en" : "zh";
  return [
    ...prompts.sections.map((section) => [section.title[key], ...section.paragraphs.map((paragraph) => paragraph[key])].join("\n\n")),
    prompts.closing?.[key],
  ].filter(Boolean).join("\n\n");
}
