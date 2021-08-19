const axios = require('axios');

const { success, failure } = require('../libs/response');
const auth = require('../libs/auth');

const gbUrl = process.env.GB_URL;
const apiKey = process.env.GB_API_KEY;

module.exports.search = auth()(async (event) => {
  const url = `${gbUrl}?api_key=${apiKey}&format=json&filter=name:${event.queryStringParameters.name}&sort=name:asc`;

  try {
    const result = await axios.get(url);
    const games = result.data.results.map((g) => {
      return {
        id: g.id,
        name: g.name,
        description: g.deck,
        image: g.image.original_url,
      };
    });
    return success({ games });
  } catch (err) {
    console.error(`Failed to search GB for games: ${err.message}`);
    return failure({ message: 'Error while searching for games.' });
  }
});
