const rp = require('request-promise-native');



function price(apiKey ,commodity){
  var url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&filters[commodity]=${commodity}`;
  return rp(url)
  .then((data) => {
    let message = JSON.parse(data);
    console.log("success");
    return Promise.resolve(message);
  }).catch((err) => {
    return Promise.reject(err)
  })
}


 function air(apiKey, state){
  var url = `https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69?api-key=${apiKey}&format=json&filters[state]=${String(state)}`;

  return rp(url) 
  .then((data) => {
     let message = JSON.parse(data);
    //  let message = responseData;
     console.log('Success');
     return Promise.resolve(message);
  }).catch((err)=> {
      return Promise.reject(err);
  });
}

module.exports = {
  air,
  price
};