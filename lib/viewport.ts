export interface ViewportMetrics {
  W: number;
  H: number;
  fs: number;
  coeffWidth: number;
  cardX: number;
  cardY: number;
  cardWidth: number;
  cardHeight: number;
  dcx: number;
  dcy: number;
  ratio: number;
  isMobile: boolean;
  isShortLandscape: boolean;
  isTablet: boolean;
}

export function computeViewportMetrics(W: number, H: number): ViewportMetrics {
  const isMobile = W <= 820 && H >= W;
  const isTablet = W >= 600 && W <= 820 && H >= W;
  const isShortLandscape = W > H && H <= 540;

  let fs: number;
  let coeffWidth: number;
  let cardWidth: number;
  let cardHeight: number;
  let cardX: number;
  let cardY = 0;
  let dcx: number;
  let dcy: number;

  if (isMobile) {
    // Elegant proportional size on mobile
    fs = Math.round(0.082 * W);
    coeffWidth = 1.5;
    cardX = 0.11 * W;
    cardWidth = 0.78 * W;
    cardHeight = 1.2675 * cardWidth;
    dcx = 0;
    dcy = -0.1 * H;
  } else {
    // Refined editorial font size so paper art & background breathe beautifully
    fs = Math.round(Math.min(0.056 * W, 0.105 * H));
    coeffWidth = 1;
    cardWidth = 0.36 * W;
    cardHeight = 0.64 * H;
    cardX = (W - cardWidth) / 2;
    dcx = 0.1 * W;
    dcy = 0;
  }

  const ratio = (0.5 * fs) / 190;

  return {
    W,
    H,
    fs,
    coeffWidth,
    cardX,
    cardY,
    cardWidth,
    cardHeight,
    dcx,
    dcy,
    ratio,
    isMobile,
    isShortLandscape,
    isTablet,
  };
}
