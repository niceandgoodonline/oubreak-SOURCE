const axios = require('axios');

module.exports = {

  makeUser(email){
    return axios
    .post('http://localhost:3000/user/RegisterUser', {email:email, username:'test', password:'$Slider23', passwordConfirm:'$Slider23'})
    .then(res => res.data)
    .catch(error => console.log(error));
  },

  getBitcoin(email) {
    return axios
      .post("http://localhost:3000/user/getBitcoin", {email:email})
      .then(res => res.data)
      .catch(error => console.log(error));
  },

  getItemArray(email) {
    return axios
      .post("http://localhost:3000/user/getItemArray", {email:email})
      .then(res => res.data)
      .catch(error => console.log(error));
  },

  makeTransaction(email) {
    return axios
      .post("http://localhost:3000/user/makeTransaction", {email:email, index:0})
      .then(res => res.data)
      .catch(error => console.log(error));
  },

  saveProgress(email) {
    return axios
      .post("http://localhost:3000/user/saveProgress", {email:email, bitcoin:0})
      .then(res => res.data)
      .catch(error => console.log(error));
  },

  getPrestigePoints(email) {
    return axios
      .post("http://localhost:3000/user/getPrestigePoints", {email:email})
      .then(res => res.data)
      .catch(error => console.log(error));
  },

  savePrestigePoints(email) {
    return axios
      .post("http://localhost:3000/user/savePrestigeProgress", {email:email, prestigePoints:0})
      .then(res => res.data)
      .catch(error => console.log(error));
  },

  makePrestigeTransaction(email) {
    return axios
      .post("http://localhost:3000/user/makePrestigeTransaction", {email:email, index:0})
      .then(res => res.data)
      .catch(error => console.log(error));
  },

  resetGainPrestige(email) {
    return axios
      .post("http://localhost:3000/user/resetGainPrestige", {email:email})
      .then(res => res.data)
      .catch(error => console.log(error));
  },

};