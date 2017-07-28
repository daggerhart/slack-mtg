"use strict";

const ts = require('./tinyspeck.js');
const db = require('./modules/deckbrew.js');

var slack = ts.instance({ });
var connected=false;

// The `slack` functions like `on()` and `send()` are provided by `tinyspeck.js`. 
slack.on('/mtg', payload => {
  //console.log(payload);
  
  let user_id = payload.user_id;
  let response_url = payload.response_url;
  let cardId = db.cardIdFromName(payload.text);
  
  db.getCardData(cardId, function(card){
    if (card.errors){
      console.log(card.errors);
      return;
    }
    if (card.editions[0].multiverse_id == 0){
      card.editions.shift(); 
    }
    let edition = card.editions[Math.floor(Math.random()*card.editions.length)];
    let card_text = card.text.split("\n").map(str => '> '+str).join("\n");
    let message = {
      response_type: "in_channel",
      text: `${card.name} - ${edition.image_url} \n${card_text}`
    };
    slack
      .send(response_url, message)
      .then(res => { // on success
        console.log("Response sent to /mtg slash command");
      }, reason => { // on failure
        console.log("An error occurred when responding to /mtg slash command: " + reason);
      });
  });
});
    
// incoming http requests
slack.listen('3000');
