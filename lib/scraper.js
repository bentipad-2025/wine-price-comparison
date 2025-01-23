import axios from 'axios';

export async function searchWine(searchTerm) {
  try {
    console.log('Searching for:', searchTerm);
    
    const response = await axios.get('https://api.danmurphys.com.au/apis/ui/Search', {
      params: {
        query: searchTerm,
        size: 24,
        page: 1
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
        'Origin': 'https://www.danmurphys.com.au',
        'Referer': 'https://www.danmurphys.com.au'
      }
    });

    console.log('API Response:', response.data);

    if (response.data && response.data.products) {
      const wines = response.data.products.map(product => ({
        name: product.name,
        retailers: [{
          name: "Dan Murphy's",
          price: parseFloat(product.price),
          link: `https://www.danmurphys.com.au/product/${product.stockcode}`
        }]
      }));
      console.log('Processed wines:', wines);
      return wines;
    }
    
    return [];
  } catch (error) {
    console.error('Search error:', error.response || error);
    return [];
  }
}
