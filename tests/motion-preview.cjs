// Browser acceptance checks: a substantial title entrance, usable scroll reveals,
// preserved project content, and a complete reduced-motion view.
const assert = require('node:assert/strict');
const { chromium } = require('/Users/yolo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

async function titleBounds(page) {
  return page.locator('#hero-title').evaluate(element => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    const text = walker.nextNode();
    range.selectNodeContents(text);
    const { y, height } = range.getBoundingClientRect();
    return { y, height };
  });
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const errors = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:5186/', { waitUntil: 'domcontentloaded' });
    await page.locator('#hero-title').waitFor();
    const early = await titleBounds(page);
    await page.waitForTimeout(3400);
    const settled = await titleBounds(page);
    assert.ok(early.height < settled.height * .9 && Math.abs(early.y - settled.y) > 40,
      `The hero needs a masked, compressed entrance, not a small fade: ${JSON.stringify({ early, settled })}`);

    for (const section of ['about', 'work', 'expertise', 'contact']) {
      await page.locator(`#${section}`).evaluate(element => window.scrollTo({ top: element.offsetTop, behavior: 'instant' }));
      await page.waitForTimeout(2400);
      assert.equal(await page.locator(`#${section} h2`).first().isVisible(), true);
      assert.ok(await page.locator(`#${section} h2`).first().evaluate(element => getComputedStyle(element).visibility !== 'hidden'));
    }
    await page.locator('#work').evaluate(element => window.scrollTo({ top: element.offsetTop + 200, behavior: 'instant' }));
    for (const [label, count] of [['食品', 1], ['美妆个护', 2], ['母婴', 1], ['其他设计', 1], ['全部作品', 5]]) {
      await page.getByRole('group', { name: '按作品类型筛选' }).getByRole('button', { name: label, exact: label !== '全部作品' }).click();
      await page.waitForTimeout(1900);
      assert.equal(await page.locator('.project-card').count(), count);
    }
    await page.locator('.project-cover').first().click();
    await page.locator('dialog[open]').waitFor();
    assert.equal(await page.locator('.project-pages img').count(), 8);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('dialog[open]').count(), 0);
    assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(200);
    const hidden = await page.locator('.hero-display, .profile-heading h2, .about-copy, .stat, .ability-card, .project-card, .contact-title-line').evaluateAll(elements => elements.filter(element => {
      const style = getComputedStyle(element);
      return style.visibility === 'hidden' || Number(style.opacity) < .99;
    }).map(element => element.className));
    assert.deepEqual(hidden, [], 'Reduced motion must expose every section immediately');
    const masked = await page.locator('.motion-title, .hero-title-word, .contact-title-line, .hero-copy-line-inner, .project-image-reveal, .project-image-depth').evaluateAll(elements => elements.filter(element => {
      const style = getComputedStyle(element);
      return style.transform !== 'none' || style.clipPath !== 'none';
    }).map(element => element.className));
    assert.deepEqual(masked, [], 'Reduced motion must clear entrance masks and image parallax');
    for (const width of [1920, 1049, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.waitForTimeout(150);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Overflow at ${width}px`);
    }
    assert.deepEqual(errors, []);
    // Use a new document, rather than treating a same-document hash change as
    // the initial React mount that this regression check needs to exercise.
    await page.goto('about:blank');
    await page.goto('http://127.0.0.1:5186/#expertise', { waitUntil: 'networkidle' });
    const targetTop = await page.locator('#expertise').evaluate(element => element.getBoundingClientRect().top);
    assert.ok(Math.abs(targetTop - 96) < 2, `Direct section links must reach their target below the floating navigation; top=${targetTop}`);
    console.log('PASS: hero entrance, section visibility, project filters/details, reduced motion, responsive widths');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
