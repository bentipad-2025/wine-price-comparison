export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { q } = req.query;
    
    // Here we would integrate with Vivino's API and retailer data
    // For now, we're using mock data
    const wineData = await searchWines(q);
    res.status(200).json(wineData);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error searching wines' });
  }
}

// Mock function to simulate wine search
async function searchWines(query) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const mockWineDatabase = [
    {
      id: 1,
      name: "Penfolds Grange 2018",
      rating: 4.8,
      retailers: [
        { name: "Dan Murphy's", price: 950.00, state: 'nsw', location: 'Sydney' },
        { name: "Vintage Cellars", price: 975.00, state: 'vic', location: 'Melbourne' }
      ]
    },
    {
      id: 2,
      name: "19 Crimes Red Blend",
      rating: 3.9,
      retailers: [
        { name: "BWS", price: 19.99, state: 'nsw', location: 'Sydney' },
        { name: "Dan Murphy's", price: 18.99, state: 'vic', location: 'Melbourne' }
      ]
    },
    {
      id: 3,
      name: "Jacob's Creek Reserve Shiraz",
      rating: 3.8,
      retailers: [
        { name: "Liquorland", price: 15.99, state: 'qld', location: 'Brisbane' },
        { name: "BWS", price: 16.99, state: 'nsw', location: 'Sydney' }
      ]
    },
    {
      id: 4,
      name: "Yellow Tail Shiraz",
      rating: 3.7,
      retailers: [
        { name: "Dan Murphy's", price: 8.99, state: 'vic', location: 'Melbourne' },
        { name: "BWS", price: 9.99, state: 'nsw', location: 'Sydney' }
      ]
    },
    {
      id: 5,
      name: "Henschke Hill of Grace",
      rating: 4.7,
      retailers: [
        { name: "Dan Murphy's", price: 865.00, state: 'sa', location: 'Adelaide' },
        { name: "Vintage Cellars", price: 889.00, state: 'vic', location: 'Melbourne' }
      ]
    }
  ];

  // Filter wines based on search query
  const results = mockWineDatabase.filter(wine => 
    wine.name.toLowerCase().includes(query.toLowerCase())
  );

  return results;
}
