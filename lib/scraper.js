// lib/scraper.js
import axios from 'axios';
import * as cheerio from 'cheerio';

const retailers = {
  danmurphys: {
    name: "Dan Murphy's",
    baseUrl: 'https://api.danmurphys.com.au/apis/ui/Search',
    async scrape(searchTerm) {
      try {
        console.log(`Searching Dan Murphy's for: ${searchTerm}`);
        const response = await axios.get(this.baseUrl, {
          params: {
            query: searchTerm,
            size: 24,
            page: 1
          },
          headers: {
            'Accept': 'application/json'
          }
        });
        
        console.log('Dan Murphys response:', response.data);
        
        if (!response.data || !response.data.products) {
          return [];
        }

        return response.data.products.map(product => ({
          name: product.name,
          price: product.price,
          retailer: this.name,
          link: `https://www.danmurphys.com.au/product/${product.id}`
        }));
      } catch (error) {
        console.error(`Error scraping ${this.name}:`, error.message);
        return [];
      }
    }
  },

  firstchoice: {
    name: "First Choice Liquor",
    baseUrl: 'https://www.firstchoiceliquor.com.au/api/search',
    async scrape(searchTerm) {
      try {
        console.log(`Searching First Choice for: ${searchTerm}`);
        const response = await axios.get(this.baseUrl, {
          params: {
            q: searchTerm
          }
        });

        if (!response.data || !response.data.products) {
          return [];
        }

        return response.data.products.map(product => ({
          name: product.name,
          price: product.price,
          retailer: this.name,
          link: product.url
        }));
      } catch (error) {
        console.error(`Error scraping ${this.name}:`, error.message);
        return [];
      }
    }
  }
};

export async function searchWine(searchTerm) {
  console.log('Starting wine search for:', searchTerm);
  
  // Search across all retailers concurrently
  const searches = Object.values(retailers).map(retailer => 
    retailer.scrape(searchTerm)
      .catch(error => {
        console.error(`Error with ${retailer.name}:`, error);
        return [];
      })
  );

  try {
    const results = await Promise.all(searches);
    console.log('Search results:', results);

    // Combine results from all retailers
    const allResults = results.flat().filter(result => result && result.name && result.price);
    console.log('Filtered results:', allResults);

    // Group by wine name
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

    const finalResults = Object.values(groupedResults);
    console.log('Final grouped results:', finalResults);
    return finalResults;
  } catch (error) {
    console.error('Error in searchWine:', error);
    throw error;
  }
}
