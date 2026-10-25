const assert = require('node:assert/strict');
const { chromium } = require('/Users/yolo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    await page.goto('http://127.0.0.1:5186/#home', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    for (const [width, height] of [[1728,823],[2048,900],[1536,864],[1366,768],[1440,1000],[1920,1080],[2560,1440],[1049,877],[768,1024],[390,844],[320,740]]) {
      await page.setViewportSize({ width, height });
      const gaps = await page.evaluate(() => {
        const box = selector => document.querySelector(selector).getBoundingClientRect();
        return {
          titleToCopy: box('.hero-editorial-content').top - box('.hero-display').bottom,
          ctaToFooter: box('.hero-bottom').top - box('.hero-editorial-cta').bottom,
          width: document.documentElement.scrollWidth,
          heroHeight: box('#home').height,
        };
      });
      assert.ok(gaps.titleToCopy >= 24, `${width}×${height}: title overlaps copy (${gaps.titleToCopy}px)`);
      assert.ok(gaps.ctaToFooter >= 24, `${width}×${height}: CTA overlaps footer (${gaps.ctaToFooter}px)`);
      assert.ok(gaps.width <= width + 1, `${width}×${height}: horizontal overflow`);
      console.log(`${width}×${height}: title/copy ${gaps.titleToCopy.toFixed(1)}px; CTA/footer ${gaps.ctaToFooter.toFixed(1)}px; hero ${gaps.heroHeight.toFixed(1)}px`);
    }
    console.log('PASS: hero sections never overlap across wide, short, tall and mobile viewports');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
