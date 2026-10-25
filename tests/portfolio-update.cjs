const assert = require('node:assert/strict');
const { chromium } = require('/Users/yolo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:5186/#work', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.project-card').count(), 5, 'The updated portfolio needs four original projects plus Other Designs');
    await page.getByRole('group', { name: '按作品类型筛选' }).getByRole('button', { name: '其他设计', exact: true }).click();
    assert.equal(await page.locator('.project-card').count(), 1);
    await page.getByRole('button', { name: '查看其他设计项目', exact: true }).click();
    await page.locator('dialog[open]').waitFor();
    assert.equal(await page.locator('.project-pages img').count(), 1);
    await page.locator('.project-pages img').evaluate(image => image.decode());
    assert.deepEqual(await page.locator('.project-pages img').evaluate(image => [image.naturalWidth, image.naturalHeight]), [1920, 3285]);
    assert.ok(await page.getByText('个人练习', { exact: true }).isVisible());
    await page.keyboard.press('Escape');
    assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');

    for (const width of [1920, 1049, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Overflow at ${width}px`);
      const span = await page.locator('.project-cover').evaluate(element => element.clientWidth / document.querySelector('.projects-grid').clientWidth);
      assert.ok(span > .98, `Other Designs should use the full gallery width at ${width}px`);
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.getByRole('button', { name: /全部作品/ }).click();
    for (const [name, count] of [['每日黑巧', 8], ['高露洁', 5], ['一叶子', 5], ['红色小象', 5]]) {
      await page.getByRole('button', { name: `查看${name}项目`, exact: true }).click();
      assert.equal(await page.locator('.project-pages img').count(), count);
      await page.keyboard.press('Escape');
    }
    const links = await page.locator('a[href^="/portfolio.pdf"]').evaluateAll(elements => elements.map(element => element.getAttribute('href')));
    assert.equal(links.length, 1, 'Only the bottom contact section should offer the PDF');
    assert.equal(await page.locator('#contact a[href^="/portfolio.pdf"]').count(), 1);
    assert.ok(links[0].includes('?v='), 'The PDF link must invalidate the old cached download');
    const response = await page.request.get('http://127.0.0.1:5186' + links[0]);
    assert.equal(response.status(), 200);
    assert.match(response.headers()['content-type'], /application\/pdf/);
    assert.ok((await response.body()).length < 25 * 1024 * 1024);
    assert.deepEqual(errors, []);
    console.log('PASS: Other Designs, personal-practice label, original project pages, responsive layout, and current PDF links');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
