export interface SpriteCrop {
  cropX: number;
  cropY: number;
  cropW: number;
  cropH: number;
}

export interface PaperObjectDef {
  quadrant: 'q0' | 'q1' | 'q2' | 'q3';
  isBack?: boolean;
  l: number; // percentage left on card
  t: number; // percentage top on card
  w: number; // percentage width relative to card width
  desktop: [number, number]; // [x, y] in desktop space
  mobile: [number, number]; // [x, y] in mobile space
  speed: number;
}

export interface ProductItem {
  id: string;
  tab: string;
  titleLines: [string, string];
  sheet: string;
  objects: PaperObjectDef[];
  floatQuadrant: 'q0' | 'q1' | 'q2' | 'q3';
  backgroundColor: string;
  cardColor: string;
  description: string;
  infoTitle: string;
  list: string[];
  loopVideo: string;
}

export interface EditorialBlockData {
  title: string;
  text: string;
  sceneSheet: 'c1' | 'c2';
  quadrant: 0 | 1 | 2 | 3;
}

export interface EditorialPageData {
  id: 'about' | 'studio' | 'journal';
  title: string;
  pageColor: string;
  coverScene: {
    sheet: 'c1' | 'c2';
    quadrant: 0 | 1 | 2 | 3;
  };
  coverDescription: string;
  blocks: EditorialBlockData[];
}

export const SPRITE_URLS: Record<string, string> = {
  s1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261111_220652_7971eee8-dbed-4c0c-88a9-cd5772b5afc9.png&w=1600&q=85',
  s2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261111_220651_df022d4d-2138-4a6e-a7c0-d3292ed6e3af.png&w=1600&q=85',
  s3: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261111_220652_551a1ee3-3deb-4057-bc02-5e070de60636.png&w=1600&q=85',
  s4: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261111_220652_d0ec09b0-b7c1-4601-90ea-dd3f2b6a9284.png&w=1600&q=85',
  s5: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261111_220650_88a4dc53-9985-4ca3-a53d-01ac559c178c.png&w=1600&q=85',
};

export const SPRITE_CROPS: Record<string, Record<'q0' | 'q1' | 'q2' | 'q3', SpriteCrop>> = {
  s1: {
    q0: { cropX: 9.18, cropY: 8.79, cropW: 39.06, cropH: 33.98 },
    q1: { cropX: 63.09, cropY: 11.72, cropW: 25.2, cropH: 31.84 },
    q2: { cropX: 14.06, cropY: 63.09, cropW: 25.59, cropH: 18.36 },
    q3: { cropX: 63.48, cropY: 63.09, cropW: 18.55, cropH: 19.14 },
  },
  s2: {
    q0: { cropX: 10.94, cropY: 8.79, cropW: 26.37, cropH: 37.89 },
    q1: { cropX: 53.91, cropY: 16.99, cropW: 40.63, cropH: 31.45 },
    q2: { cropX: 14.45, cropY: 58.79, cropW: 24.02, cropH: 25.59 },
    q3: { cropX: 58.59, cropY: 62.5, cropW: 25.98, cropH: 22.07 },
  },
  s3: {
    q0: { cropX: 12.11, cropY: 3.91, cropW: 26.56, cropH: 41.8 },
    q1: { cropX: 58.01, cropY: 13.09, cropW: 35.35, cropH: 28.91 },
    q2: { cropX: 12.89, cropY: 54.1, cropW: 25.98, cropH: 35.74 },
    q3: { cropX: 58.01, cropY: 63.67, cropW: 33.59, cropH: 21.68 },
  },
  s4: {
    q0: { cropX: 4.3, cropY: 5.86, cropW: 42.77, cropH: 39.65 },
    q1: { cropX: 55.08, cropY: 10.94, cropW: 38.28, cropH: 33.59 },
    q2: { cropX: 13.09, cropY: 60.16, cropW: 28.32, cropH: 25.2 },
    q3: { cropX: 60.35, cropY: 58.98, cropW: 24.22, cropH: 30.08 },
  },
  s5: {
    q0: { cropX: 6.25, cropY: 10.35, cropW: 39.06, cropH: 28.52 },
    q1: { cropX: 59.96, cropY: 7.62, cropW: 29.88, cropH: 33.2 },
    q2: { cropX: 16.21, cropY: 57.23, cropW: 25, cropH: 28.71 },
    q3: { cropX: 0, cropY: 0, cropW: 1, cropH: 1 }, // empty
  },
};

export const SCENE_SHEETS: Record<string, string> = {
  c1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261111_220553_70fa0711-1de7-4c3c-85e7-cafe4934e3c2.png&w=2048&q=85',
  c2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261111_220552_1b871352-ee7b-49f9-9834-95c47ffa249a.png&w=2048&q=85',
};

export const INTRO_FILM_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261111_224117_b319aa12-0927-4642-99b2-12727753649b.mp4';

export const PRODUCTS: ProductItem[] = [
  {
    id: 'morpho',
    tab: 'Morpho',
    titleLines: ['Morpho', 'wings'],
    sheet: 's1',
    floatQuadrant: 'q3',
    backgroundColor: '#F7C6B2',
    cardColor: '#FBDDD0',
    description: "Our Morpho series is folded from forty-two hand-cut sheets of cobalt and ink paper. Every wing is scored by hand so the facets catch the light the way a living Morpho does, then mounted to hover a finger's width off the wall.",
    infoTitle: 'Morpho wings',
    list: [
      '42 folds in every butterfly',
      'Cobalt, ink and pearl papers',
      'Mounted on a hidden brass pin',
      'Shipped flat in a linen sleeve',
      'Signed and numbered editions of 60.',
    ],
    loopVideo: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261111_224035_63943978-3c02-4c51-81ab-fc2c80896997.mp4',
    objects: [
      {
        quadrant: 'q1',
        isBack: true,
        l: 50,
        t: 8,
        w: 27,
        desktop: [23, 13],
        mobile: [33, 23],
        speed: 0.9,
      },
      {
        quadrant: 'q0',
        l: 2,
        t: 40,
        w: 43,
        desktop: [7, 41],
        mobile: [2, 51],
        speed: 1.1,
      },
      {
        quadrant: 'q2',
        l: 60,
        t: 46,
        w: 31,
        desktop: [70, 45],
        mobile: [62, 55],
        speed: 1.2,
      },
    ],
  },
  {
    id: 'koi',
    tab: 'Koi',
    titleLines: ['Koi', 'carp'],
    sheet: 's2',
    floatQuadrant: 'q3',
    backgroundColor: '#B7D3F3',
    cardColor: '#D2E3F8',
    description: 'Each koi begins as a single sheet of coral paper and a single sheet of white. We fold the two together so the pattern runs through the body like real scales, then shape the long tail fins by hand until they look caught mid-turn.',
    infoTitle: 'Koi carp',
    list: [
      'Two-sheet fold for true markings',
      'Fins shaped by hand, never cut',
      'Coral, pearl and gold papers',
      'Hung on a near-invisible line',
      'Signed and numbered editions of 48.',
    ],
    loopVideo: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261111_224035_452afb5a-4a77-4caf-80d6-fae74e5aa7ac.mp4',
    objects: [
      {
        quadrant: 'q0',
        isBack: true,
        l: 16,
        t: 3,
        w: 27,
        desktop: [19, 9],
        mobile: [10, 21],
        speed: 0.9,
      },
      {
        quadrant: 'q2',
        l: 6,
        t: 46,
        w: 28,
        desktop: [11, 47],
        mobile: [4, 53],
        speed: 1.1,
      },
      {
        quadrant: 'q1',
        l: 50,
        t: 38,
        w: 47,
        desktop: [64, 41],
        mobile: [46, 54],
        speed: 1.25,
      },
    ],
  },
  {
    id: 'beetroot',
    tab: 'Beetroot',
    titleLines: ['Ruby', 'beetroot'],
    sheet: 's3',
    floatQuadrant: 'q3',
    backgroundColor: '#BEE5D3',
    cardColor: '#D7F0E4',
    description: 'Our garden pieces start in the kitchen garden behind the studio. We study the real roots through the season, then fold them in deep magenta stock with leaves pressed from a darker green, so a bowl of them looks freshly pulled.',
    infoTitle: 'Ruby beetroot',
    list: [
      'Studied from our own garden rows',
      'Magenta stock with pressed leaves',
      'Sold singly or as a bunch of three',
      'Lacquer-free, matte finish',
      'Made to order in four weeks.',
    ],
    loopVideo: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261111_224035_23822af0-dadb-411e-b7da-6ef2d4f4490c.mp4',
    objects: [
      {
        quadrant: 'q0',
        isBack: true,
        l: 46,
        t: 3,
        w: 28,
        desktop: [22, 10],
        mobile: [30, 20],
        speed: 0.9,
      },
      {
        quadrant: 'q2',
        l: 4,
        t: 42,
        w: 29,
        desktop: [7, 44],
        mobile: [3, 52],
        speed: 1.1,
      },
      {
        quadrant: 'q1',
        l: 58,
        t: 42,
        w: 38,
        desktop: [68, 43],
        mobile: [58, 55],
        speed: 1.2,
      },
    ],
  },
  {
    id: 'betta',
    tab: 'Betta',
    titleLines: ['Betta', 'fins'],
    sheet: 's4',
    floatQuadrant: 'q3',
    backgroundColor: '#F6E3A1',
    cardColor: '#FAEDC4',
    description: 'The betta is our most layered fold. Its tail alone takes sixty pleats of violet and crimson tissue, set one over another so light passes through the edges. We hang each one as if it has just flared at its own reflection.',
    infoTitle: 'Betta fins',
    list: [
      'Sixty pleats in every tail',
      'Violet, crimson and teal tissue',
      'Light passes through the fin edges',
      'Ships in a rigid display box',
      'Signed and numbered editions of 36.',
    ],
    loopVideo: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261111_224035_ae5474fc-8fdf-4fc4-8445-8a69340fbaf3.mp4',
    objects: [
      {
        quadrant: 'q0',
        isBack: true,
        l: 36,
        t: 1,
        w: 44,
        desktop: [24, 7],
        mobile: [14, 20],
        speed: 0.9,
      },
      {
        quadrant: 'q2',
        l: 6,
        t: 46,
        w: 30,
        desktop: [11, 46],
        mobile: [4, 52],
        speed: 1.1,
      },
      {
        quadrant: 'q1',
        l: 56,
        t: 42,
        w: 40,
        desktop: [67, 43],
        mobile: [56, 56],
        speed: 1.3,
      },
    ],
  },
  {
    id: 'monarch',
    tab: 'Monarch',
    titleLines: ['Monarch', 'flight'],
    sheet: 's5',
    floatQuadrant: 'q2',
    backgroundColor: '#CDBBF2',
    cardColor: '#DFD3F7',
    description: 'Monarchs travel thousands of miles each autumn, and this series follows their route. Each butterfly is folded from orange and black paper and finished with a hand-painted white border, so no two wings are quite the same.',
    infoTitle: 'Monarch flight',
    list: [
      'Hand-painted wing borders',
      'Orange, ink and bone papers',
      'Sold singly or as a flight of five',
      'Mounted on a hidden brass pin',
      'Signed and numbered editions of 60.',
    ],
    loopVideo: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261111_224035_37ddbd70-4e22-4d23-a87e-1f46b4851fff.mp4',
    objects: [
      {
        quadrant: 'q1',
        isBack: true,
        l: 52,
        t: 5,
        w: 30,
        desktop: [22, 12],
        mobile: [33, 22],
        speed: 0.9,
      },
      {
        quadrant: 'q0',
        l: 4,
        t: 38,
        w: 46,
        desktop: [8, 41],
        mobile: [2, 51],
        speed: 1.1,
      },
      {
        quadrant: 'q2',
        l: 62,
        t: 46,
        w: 27,
        desktop: [70, 46],
        mobile: [62, 56],
        speed: 1.2,
      },
    ],
  },
];

export const EDITORIAL_PAGES: Record<string, EditorialPageData> = {
  about: {
    id: 'about',
    title: 'Foldwild Studio',
    pageColor: '#BEE5D3',
    coverScene: { sheet: 'c1', quadrant: 0 },
    coverDescription: 'Foldwild is a small paper studio that folds butterflies, fish and garden produce by hand. Every piece is designed, scored and folded in our workshop, from a single sheet or a few, with no glue on show.',
    blocks: [
      {
        title: 'History',
        sceneSheet: 'c2',
        quadrant: 1,
        text: 'Foldwild began in 2016 on a kitchen table with a stack of offcuts and a single blue butterfly. The first pieces went to friends, then to a neighbourhood market. Today a team of eight folds every edition in a bright studio above a print shop, still by hand and still one sheet at a time.',
      },
      {
        title: 'The garden',
        sceneSheet: 'c2',
        quadrant: 2,
        text: 'Behind the studio we keep a small kitchen garden. We grow the beetroot, squash and peppers that our produce series is modelled on, and we sketch them through the season. When a root is pulled, it comes inside to the workbench so we can study the shape before we fold it.',
      },
      {
        title: 'Market days',
        sceneSheet: 'c1',
        quadrant: 2,
        text: 'Once a month we load a cart and take new pieces to the market in person. It is where we hear what people love, which colours they reach for and which folds make children laugh. Many of our best ideas started as a question asked over the cart.',
      },
    ],
  },
  studio: {
    id: 'studio',
    title: 'The Studio',
    pageColor: '#CDBBF2',
    coverScene: { sheet: 'c1', quadrant: 3 },
    coverDescription: 'Our studio is a long room with north light, three cutting tables and a wall of paper. Here we design new folds, test them dozens of times and keep a library of every pattern we have ever made.',
    blocks: [
      {
        title: 'Paper first',
        sceneSheet: 'c2',
        quadrant: 0,
        text: 'We source papers from three mills that still make them slowly. Each colour is chosen for how it holds a crease and how it turns in the light. A koi needs a soft, strong sheet; a betta tail needs tissue so thin the light passes straight through.',
      },
      {
        title: 'Testing a fold',
        sceneSheet: 'c2',
        quadrant: 3,
        text: 'A new design is folded around thirty times before it joins a collection. We trim, re-score and refold until the piece holds its shape without support. Only then do we write the pattern down and number the first edition.',
      },
      {
        title: 'Workshops',
        sceneSheet: 'c1',
        quadrant: 3,
        text: 'Twice a season we open the studio for small workshops. Guests fold a simple butterfly or a fish, and leave with a pattern sheet so they can keep folding at home. Places are limited to ten so everyone gets time at the table.',
      },
    ],
  },
  journal: {
    id: 'journal',
    title: 'Journal',
    pageColor: '#F7C6B2',
    coverScene: { sheet: 'c1', quadrant: 1 },
    coverDescription: 'Notes from the studio: where our ideas come from, what we are folding next and the people and places that shape each collection.',
    blocks: [
      {
        title: 'By the sea',
        sceneSheet: 'c2',
        quadrant: 3,
        text: 'Our koi and betta pieces began on a week by the coast, watching fish turn in rock pools. We came home with a notebook of sketches and a box of shells, and spent the winter learning how to fold movement into a fin.',
      },
      {
        title: 'The koi pond',
        sceneSheet: 'c2',
        quadrant: 0,
        text: 'A neighbour lent us their pond for a summer of study. We sat by it most mornings, drawing the way the koi bend and gather. The curve of our koi series comes straight from those mornings, folded into paper over many attempts.',
      },
      {
        title: 'Next season',
        sceneSheet: 'c2',
        quadrant: 2,
        text: 'Next season we are working on a series of garden roots and a new flight of moths, folded in softer papers with hand-painted edges. As always, we will share the first pieces here before they reach the studio shelves.',
      },
    ],
  },
};
