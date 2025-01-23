import playwright from 'playwright-aws-lambda';

export async function searchWine(searchTerm) {
  try {
    const browser = await playwright.launchChromium();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto(`https://www.wine-searcher.com/find/${encodeURIComponent(searchTerm)}/australia`);
    await page.waitForLoadState('networkidle');

    const results = await page.evaluate(() => {
      const wines = [];
      document.querySelectorAll('.find-tab-wine').forEach(item => {
        const retailers = [];
        item.querySelectorAll('.price-col').forEach(price => {
          if (price.querySelector('.merchant-name') && price.querySelector('.price')) {
            retailers.push({
              name: price.querySelector('.merchant-name').textContent.trim(),
              price: parseFloat(price.querySelector('.price').textContent.replace('AU$', '').trim()),
              link: price.querySelector('a')?.href || '#'
            });
          }
        });
        
        if (retailers.length > 0) {
          wines.push({
            name: item.querySelector('.wine-name')?.textContent.trim(),
            retailers: retailers
          });
        }
      });
      return wines;
    });

    await browser.close();
    return results;
  } catch (error) {
    console.error('Scraping error:', error);
    return [];
  }
}
