import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { q } = req.query;
    
    // Make request to wine API
    const response = await axios({
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_API_URL}/search`,
      params: {
        q: q,
        country: 'australia' // Filter for Australian availability
      },
      headers: {
        'Authorization': `Bearer ${process.env.WINE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Transform the API response to match our expected format
    const transformedData = response.data.map(wine => ({
      id: wine.id,
      name: wine.name,
      rating: wine.rating,
      image: wine.image,
      year: wine.year,
      winery: wine.winery,
      retailers: wine.retailers.map(retailer => ({
        name: retailer.name,
        price: retailer.price,
        state: retailer.state,
        location: retailer.city,
        url: retailer.url
      }))
    }));

    res.status(200).json(transformedData);
  } catch (error) {
    console.error('Wine API error:', error);
    res.status(500).json({ 
      message: 'Error fetching wine data',
      error: error.message 
    });
  }
}
