// Adapted from the Niltavi Notion essay; the source link records content provenance.
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
        zh: "Niltavi [nɪlˈtɑːvi] 的灵感来自栖息于森林中的仙鹟。它拥有鲜明而纯净的蓝色羽毛，点缀着温暖的黄色，在深邃的森林绿意之间呈现出一种安静而生动的美。这种色彩关系构成了我们的视觉起点：以蓝色表达自由、清澈与探索，以黄色传递温度、生命力与偶然的惊喜，以森林绿承载自然的深度、宁静与归属感。我们将这些源于自然的颜色转化为克制、柔和而富有层次的视觉语言，让鲜明的生命色彩在低饱和的环境中自然浮现。",
        en: "Niltavi [nɪlˈtɑːvi] takes its inspiration from the niltava, a bird of the forest. Clear blue plumage, touched with warm yellow, holds a quiet, living beauty against the depth of green. Here our visual language begins: blue for freedom, clarity, and the urge to explore; yellow for warmth, vitality, and the grace of a chance encounter; forest green for stillness, depth, and a sense of belonging. Drawn from nature, these colors become a language of softness, restraint, and subtle layers, allowing the bright colors of life to emerge from a muted world.",
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

export const editorialContent = {philosophy};
