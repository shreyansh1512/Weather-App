import express from 'express';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.static('src'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});





app.get('/search', (req, res) => {
  const query = req.query.q;

  // Perform search logic here using GeoDB Cities API
  const rapidAPIKey = 'f561f21119msha0feb360f676152p1bb0bbjsn2a8f193dbadd';
  const rapidAPIHost = 'wft-geo-db.p.rapidapi.com';

  const rapidAPIEndpoint = `https://${rapidAPIHost}/v1/geo/cities?minPopulation=1000000&namePrefix=${query}&limit=5`;

  fetch(rapidAPIEndpoint, {
    headers: {
      'x-rapidapi-key': rapidAPIKey,
      'x-rapidapi-host': rapidAPIHost,
      'useQueryString': true
    }
  })
    .then(response => response.json())
    .then(options => {
      // Process the received data and format it as per your needs
      const formattedResults = formatSearchResults(options);

      res.json(formattedResults);
    })
    .catch(error => {
      console.log('Error fetching search results:', error);
      res.status(500).json({ error: 'An error occurred while fetching search results.' });
    });
});


function formatSearchResults(options) {
  // Check if the data object exists and has the data property
  if (options && options.data && Array.isArray(options.data)) {
    // Process and format the received data based on your requirements
    // Return the formatted results as an array of objects
    return options.data.map(result => ({
      longitude: result.longitude,
      latitude: result.latitude,
      city: result.city,
      countryCode: result.countryCode,
    }));
  } else {
    console.log('Invalid search results format:', options);
    return [];
  }
}

