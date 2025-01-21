// pages/api/wines/search.js
import { searchWine } from '../../../lib/scraper';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { q } = req.query;
    
    if (!q || q.length < 3) {
      return res.status(400).json({ 
        message: 'Search term must be at least 3 characters long' 
      });
    }

    const results = await searchWine(q);
    res.status(200).json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      message: 'Error searching wines',
      error: error.message 
    });
  }
}
