"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const key = require('./assets/key');
const api = require('./assets/functions');
admin.initializeApp();
const { dialogflow, Suggestions, SimpleResponse } = require('actions-on-google');
const app = dialogflow({
    debug: true
});
let suggestions
const apiKey = key.dataGOVKey;



app.intent("Default Welcome Intent", conv => {
  suggestions = ['Air Quality', 'Commodity Price', 'Quit']
  conv.ask("Hi! I am informer. I can tell you Prices of different Commodity, Real timeAir index quality of different cities and many other. What you like to know? ");
  conv.ask(new Suggestions(suggestions));
});

app.intent("airQuality", conv => {
  suggestions = ['Andhra_Pradesh', 'Delhi', 'Assam', 'Bihar', 'Gujarat', 'Quit']
  conv.ask("Please tell me the state name whose air quality you want to check.");
  conv.ask(new Suggestions(suggestions));
})

app.intent("airQuality - custom", conv => {
  const statename = (conv.parameters['stateName']);
  if(statename){
  return api.air(apiKey, statename).then(message => {
    conv.close(`The main air pollutants of ${statename} is ${message.records[0].pollutant_id} with min quantity: ${message.records[0].pollutant_min} and maximum: ${message.records[0].pollutant_max}`);
    return Promise.resolve();

  }).catch((err) => {
          conv.close("Oops!, looks like the government api isn't working right now. Please try again later");
      return Promise.resolve();
   
  })
} else{
  conv.close("Sorry, but the government api dosen't provide data for your state.");
  
}
})
//......................................................................................
app.intent("price", conv => {
  suggestions = ['Apple', 'onion', 'Potato', 'Rice', 'Wheat', 'Cotton', 'Quit'];
  conv.ask(`Please tell me the product whose price you want to know. Some examples are given in Suggestions. You can say "help" to know all available products whose price i know`)
  conv.ask(new Suggestions(suggestions));
})

app.intent("price - custom", conv => {
  const product = (conv.parameters['commodity']);
  if(product){
    return api.price(apiKey, product).then(message => {
      let state = [];
      let districts = [];
      let prices = [];
      let output = [];
      const length = message.records.length;
      for(let i=0;i<length;i++){
          state[i] = message.records[i].state;
          districts[i] = message.records[i].district;
          prices[i] = message.records[i].modal_price;
          output[i] = `${prices[i]} in district ${districts[i]} of ${state[i]},  \n`;
      }
      conv.close(new SimpleResponse({
        speech: `The Price of ${product} is ${message.records[0].modal_price} in ${message.records[0].state}`,
        text: `The prices of ${product} are : ${output.toString()}`,
      }));
      return Promise.resolve();
    }).catch((err) => {
      conv.close(`${err}Oops!, looks like the government api isn't working right now. Please try again later`);
    })
  
  }else{
    suggestions = ['Help', 'Quit'];
    conv.ask("Sorry!, currently i don't know the price of this product. Try saying Help to know all the products whose price i know.");
    conv.ask(new Suggestions(suggestions));
  }
});


app.intent("price with commodity", conv => {
  const product = (conv.parameters['commodity']);
  if(product){
    return api.price(apiKey, product).then(message => {
      let state = [];
      let districts = [];
      let prices = [];
      let output = [];
      const length = message.records.length;
      for(let i=0;i<length;i++){
          state[i] = message.records[i].state;
          districts[i] = message.records[i].district;
          prices[i] = message.records[i].modal_price;
          output[i] = `${prices[i]} in district ${districts[i]} of ${state[i]},  \n`;
      }
      conv.close(new SimpleResponse({
        speech: `The Price of ${product} is ${message.records[0].modal_price} in ${message.records[0].state}`,
        text: `The prices of ${product} are : ${output.toString()}`,
      }));
      return Promise.resolve();
    }).catch((err) => {
      conv.close(`${err}Oops!, looks like the government api isn't working right now. Please try again later`);
    })
  
  }else{
    suggestions = ['Help', 'Quit'];
    conv.ask("Sorry!, currently i don't know the price of this product. Try saying Help to know all the products whose price i know.");
    conv.ask(new Suggestions(suggestions));
  }
});

app.intent("help", conv => {
  conv.ask(new SimpleResponse({
    speech: `The different commodities include Apple, Onion, Bengal Gram, Masur Dal and etc.`,
    text: `The different commodities include Apple, Onion, Bengal Gram, Masur Dal, Potato, Rice, Wheat, Bajra, Castor Seed, Cotton, Guar Seed, Maize, Bottle gourd, Ginger, Lady Finger, Brinjal, Cabbage, Grapes, Kinnow, Peas, Raddish, Tomato, Amaranthus, Amphophalus, Ashgourd, Banana, Beetroot, Bitter gourd, Carrot, Cauliflower, Coconut Seed, Cowpea, Cucumbar, Drumstick, French Beans, Green Chilli, Pumpkin, Urd Beans, Capsicum, Orange, Paddy, Sugar, Wheat Atta, Little gourd, Papaya, Pomegranate, Apple, Lemon and Barley.`
  }))
})
exports.googleAction = functions.https.onRequest(app);
