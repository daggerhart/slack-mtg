const http = require('http');

const imageUrlPattern = 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid={:multiverse_id}&type=card';

/**
 * Convert a human-typed card name into a slug as expected by DeckBrew API
 */
function cardIdFromName( card_name )
{
  var deckBrewId = card_name
    .trim()
    .toLowerCase()
    .replace(/\ /g, '-')
    .replace(/[^A-Za-z0-9-]/g,'');
  
  console.log(deckBrewId);
  
  return deckBrewId;
}

/**
 * Fetch the JSON card data from the API
 */
function getCardData( deckBrewId, callback )
{
  http.get('http://api.deckbrew.com/mtg/cards/'+deckBrewId, (response) => {
    var data = '';
    response.on('data', function(chunk) {
      data += chunk;
    });
    response.on('end', function() {
      callback( JSON.parse(data) );
    });
  })
  .on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}

module.exports = {
  cardIdFromName,
  getCardData
};