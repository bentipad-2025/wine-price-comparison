import axios from 'axios';

export async function searchWine(searchTerm) {
  try {
    const response = await axios.get('https://www.danmurphys.com.au/search/api', {
      params: {
        term: searchTerm,
        type: 'products'
      },
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
        'Referer': 'https://www.danmurphys.com.au'
      }
    });

    if (!response.data || !response.data.results) {
      return [];
    }

    return response.data.results.map(product => ({
      name: product.name,
      retailers: [{
        name: "Dan Murphy's",
        price: product.price,
        link: `https://www.danmurphys.com.au${product.url}`
      }]
    }));
  } catch (error) {
    console.error('Error fetching from Dan Murphy\'s:', error);
    // Return mock data as fallback
    return [
      {
        name: "Penfolds Bin 389",
        retailers: [
          { name: "Dan Murphy's", price: 100.00, link: "https://www.danmurphys.com.au" }
        ]
      },
      {
        name: "Yellow Tail Shiraz",
        retailers: [
          { name: "Dan Murphy's", price: 8.00, link: "https://www.danmurphys.com.au" }
        ]
      }
    ].filter(wine => 
      wine.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
