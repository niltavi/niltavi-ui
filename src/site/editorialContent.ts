// Adapted from the Niltavi Notion essay; the source link records content provenance.
type Copy = {en: string; zh: string};
/** A single niltavi-banner motif, named by its print style; Editorial.tsx resolves the artwork. */
export type EditorialMotif = {style: "screenprint" | "stamp" | "woodcut"};
/** A section body is a run of paragraphs, with an occasional bulleted list or row of motifs. */
export type EditorialBlock = Copy | {list: Copy[]} | {motifs: EditorialMotif[]};
type EditorialSection = {id: string; title: Copy; paragraphs: EditorialBlock[]; quote?: Copy};
type EditorialContent = {source: string; title?: Copy; lead?: Copy; sections: EditorialSection[]; closing?: Copy};

export const philosophy: EditorialContent = {
  source: "https://app.notion.com/p/40e44fed5856810b8272effb59207522",
  title: {
    zh: "niltavi 为数字游民的理想生活而生",
    en: "niltavi is made for the life a digital nomad dreams of",
  },
  lead: {
    zh: "“更少的信息过载，更少的决策成本，更少的工作时间”",
    en: "“Less information overload, fewer decisions, fewer working hours.”",
  },
  sections: [
    {
      id: "naturalism",
      title: {en: "Naturalism in the Digital Age", zh: "数字时代的自然主义"},
      paragraphs: [
        {
          zh: "在人工智能不断拓展人类能力边界的时代，我们希望重新唤起人们对自然、感知与自我体验的关注。",
          en: "As AI keeps pushing the limits of what people can do, we want to bring attention back to nature, to the senses, and to our own experience.",
        },
        {
          zh: "技术让世界变得更加高效、精确和丰富的同时，人类不应该越来越忙碌。",
          en: "Technology is making the world more efficient, precise, and abundant. That shouldn't leave people busier than before.",
        },
        {
          zh: "自然提醒我们，生活中仍有许多值得亲自感受的事物：一束穿过树叶的阳光、一阵微风、一只偶然停留在枝头的鸟，以及那些无法被计算的细微瞬间。",
          en: "Nature reminds us how much in life is still worth feeling firsthand: sunlight through the leaves, a light breeze, a bird that happens to land on a branch, and the small moments no one can calculate.",
        },
      ],
    },
    {
      id: "color",
      title: {en: "niltavi's colors come from the forest", zh: "niltavi 的色彩来自森林"},
      paragraphs: [
        {
          zh: "niltavi [nɪlˈtɑːvi] 的灵感来自栖息于森林中的仙鹟。这种鸟儿拥有鲜明而纯净的蓝色羽毛，点缀着温暖的黄色，在深邃的森林绿意之间呈现出一种安静而生动的美。",
          en: "niltavi [nɪlˈtɑːvi] is inspired by the niltava, a flycatcher that lives in the forest. Its feathers are a vivid, clean blue touched with warm yellow, quiet and alive against the deep green of the trees.",
        },
        {
          zh: "这种鸟儿与自然的色彩关系，构成了我们的视觉起点：",
          en: "The colors of this bird and its forest are where our visual language starts:",
        },
        {list: [
          {zh: "以蓝色表达自由、清澈与探索", en: "Blue for freedom, clarity, and exploration"},
          {zh: "以黄色传递温度、生命力与偶然的惊喜", en: "Yellow for warmth, vitality, and happy accidents"},
          {zh: "以森林的晨曦淡黄和夜晚深蓝作为基底色，承载自然的深度、宁静与归属感", en: "The pale yellow of a forest dawn and the deep blue of its night as base colors, for depth, calm, and belonging"},
        ]},
        {
          zh: "我们将这些源于自然的颜色转化为克制、柔和而富有层次的视觉语言，让鲜明的生命色彩在低饱和的环境中自然浮现。",
          en: "We turn these colors into a restrained, soft, layered visual language, so the bright colors of life can stand out against a muted background.",
        },
      ],
    },
    {
      id: "form",
      title: {en: "People and nature, in harmony", zh: "人与自然，和谐相处"},
      paragraphs: [
        {
          zh: "在表现形式上，我们从“图鉴插图、民艺橡皮章、木刻版画”中汲取灵感，并以现代平面矢量语言重新诠释。",
          en: "Our illustrations draw on field-guide plates, folk rubber stamps, and woodcut prints, redrawn in a modern flat vector style.",
        },
        {motifs: [
          {style: "screenprint"},
          {style: "stamp"},
          {style: "woodcut"},
        ]},
        {
          zh: "清晰的轮廓、纯粹的色块与简洁的几何构图，赋予画面现代设计的秩序与轻盈；羽毛、枝叶之间细腻而富有方向感的刻线，则保留了传统手工艺术的温度与生命感。",
          en: "Clear outlines, solid blocks of color, and simple geometry give the image the order and lightness of modern design. Fine cuts that follow feathers and leaves keep the warmth and life of handmade craft.",
        },
        {
          zh: "我们珍视这种精确与自然之间的微妙平衡。",
          en: "We value this balance between precision and nature.",
        },
        {
          zh: "我们相信，质感无需依赖繁复的装饰。温暖的纸张底色、舒展的留白、优雅的文字与克制的细节，足以营造一种安静而持久的美。",
          en: "We believe quality doesn't need heavy decoration. Warm paper tones, generous space, graceful type, and restrained details are enough to make something quietly and lastingly beautiful.",
        },
      ],
      quote: {
        zh: "鲜明的生命色彩，存在于宁静而克制的环境之中。",
        en: "The vivid colors of life,\nheld in a world of quiet restraint.",
      },
    },
  ],
};

export const editorialContent = {philosophy};
