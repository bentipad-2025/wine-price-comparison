import chromium from 'chrome-aws-lambda';

export async function searchWine(searchTerm) {
  try {
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    await page.goto(`https://www.wine-searcher.com/find/${encodeURIComponent(searchTerm)}/australia`, {
      waitUntil: 'networkidle0'
    });

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
