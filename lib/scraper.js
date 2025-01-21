// lib/scraper.js
import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import axios from 'axios';

const retailers = {
  danmurphys: {
    name: "Dan Murphy's",
    baseUrl: 'https://www.danmurphys.com.au/search',
    async scrape(searchTerm) {
      try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.goto(`${this.baseUrl}?query=${encodeURIComponent(searchTerm)}`);
        
        // Wait for results to load
        await page.waitForSelector('.product-tile');
        
        const results = await page.evaluate(() => {
          const products = [];
          document.querySelectorAll('.product-tile').forEach(tile => {
            products.push({
              name: tile.querySelector('.product-name')?.innerText,
              price: parseFloat(tile.querySelector('.price-dollars')?.innerText.replace('$', '')),
              link: tile.querySelector('a')?.href
            });
          });
          return products;
        });

        await browser.close();
        return results.map(product => ({
          ...product,
          retailer: this.name
        }));
      } catch (error) {
        console.error(`Error scraping ${this.name}:`, error);
        return [];
      }
    }
  },

  bws: {
    name: "BWS",
    baseUrl: 'https://bws.com.au/search',
    async scrape(searchTerm) {
      try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.goto(`${this.baseUrl}?searchTerm=${encodeURIComponent(searchTerm)}`);
        
        await page.waitForSelector('.product-tile');
        
        const results = await page.evaluate(() => {
          const products = [];
          document.querySelectorAll('.product-tile').forEach(tile => {
            products.push({
              name: tile.querySelector('.product-name')?.innerText,
              price: parseFloat(tile.querySelector('.price')?.innerText.replace('$', '')),
              link: tile.querySelector('a')?.href
            });
          });
          return products;
        });

        await browser.close();
        return results.map(product => ({
          ...product,
          retailer: this.name
        }));
      } catch (error) {
        console.error(`Error scraping ${this.name}:`, error);
        return [];
      }
    }
  },

  vinomofo: {
    name: "Vinomofo",
    baseUrl: 'https://www.vinomofo.com.au/search',
    async scrape(searchTerm) {
      try {
        const response = await axios.get(`${this.baseUrl}?q=${encodeURIComponent(searchTerm)}`);
        const $ = cheerio.load(response.data);
        
        const results = [];
        $('.product-card').each((i, el) => {
          results.push({
            name: $(el).find('.product-name').text().trim(),
            price: parseFloat($(el).find('.price').text().replace('$', '')),
            link: $(el).find('a').attr('href')
          });
        });

        return results.map(product => ({
          ...product,
          retailer: this.name
        }));
      } catch (error) {
        console.error(`Error scraping ${this.name}:`, error);
        return [];
      }
    }
  }
};

export async function searchWine(searchTerm) {
  // Search across all retailers concurrently
  const searches = Object.values(retailers).map(retailer => 
    retailer.scrape(searchTerm)
  );

  const results = await Promise.allSettled(searches);

  // Combine results from all retailers
  const allResults = results
    .filter(result => result.status === 'fulfilled')
    .flatMap(result => result.value)
    .filter(result => result && result.name && result.price);

  // Group by wine name to combine prices from different retailers
  const groupedResults = {};
  allResults.forEach(result => {
    if (!groupedResults[result.name]) {
      groupedResults[result.name] = {
        name: result.name,
        retailers: []
      };
    }
    groupedResults[result.name].retailers.push({
      name: result.retailer,
      price: result.price,
      link: result.link
    });
  });

  return Object.values(groupedResults);
}
