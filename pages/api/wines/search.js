// pages/api/wines/search.js
import { searchWine } from '../../../lib/scraper';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { q } = req.query;
    console.log('Received search request for:', q);
    
    if (!q || q.length < 3) {
      console.log('Search term too short');
      return res.status(400).json({ 
        message: 'Search term must be at least 3 characters long' 
      });
    }

    console.log('Calling searchWine function');
    const results = await searchWine(q);
    console.log('Search completed, results:', results);

    // If no results found, return empty array but with 200 status
    if (!results || results.length === 0) {
      console.log('No results found');
      return res.status(200).json([]);
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      message: 'Error searching wines',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
