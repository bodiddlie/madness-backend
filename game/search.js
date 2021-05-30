const {success, failure} = require('../libs/response');
const axios = require('axios');

const gbUrl = process.env.GB_URL;
const apiKey = process.env.GB_API_KEY;

module.exports.search = async event => {
  const url = `${gbUrl}?api_key=${apiKey}&format=json&filter=name:${event.queryStringParameters.name}`;

  try {
    const result = await axios.get(url);
    const games = result.data.results.map(g => {
      return {
        name: g.name,
        description: g.deck,
        image: g.image.screen_url
      };
    });
    return success({games});
  } catch (err) {
    console.error(`Failed to search GB for games: ${err.message}`);
    return failure({message: 'Error while searching for games.'});
  }
}