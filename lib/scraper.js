import axios from 'axios';

export async function searchWine(searchTerm) {
  try {
    const response = await axios.get('https://api.danmurphys.com.au/apis/ui/Search', {
      params: {
        query: searchTerm,
        size: 24,
        page: 1
      },
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.data || !response.data.products) {
      return [];
    }

    return response.data.products.map(product => ({
      name: product.name,
      retailers: [{
        name: "Dan Murphy's",
        price: product.price,
        link: `https://www.danmurphys.com.au/product/${product.stockcode}`
      }]
    }));
  } catch (error) {
    console.error('Error fetching from Dan Murphy\'s:', error);
    return [];
  }
}
