import axios from 'axios';

async function getPublicIP() {
  const publicIP = await axios.get('https://api.ipify.org?format=json', {});
  return publicIP.data.ip;
}

function calculateAverage(newRating, { numRatings, avgRating }) {
  return (numRatings * avgRating + newRating) /
  (numRatings + 1);
}

async function getRating(currentPainting) {
  console.log(currentPainting)
  const documentRating = await window.db.collection('painting')
    .doc(`${currentPainting}`)
    .get();
  return documentRating.exists ? documentRating.data().avgRating : 1;
}

async function sendRating(currentPainting, rating) {
  const documentPainting = window.db.collection('painting').doc(currentPainting);
  await window.db.runTransaction(async transaction => {
    const doc = await transaction.get(documentPainting)
    const data = doc.data();
  
    const newAverage = calculateAverage(rating, { data });
  
    transaction.update(documentPainting, {
      numRatings: data.numRatings + 1,
      avgRating: newAverage,
    });
    return Promise.resolve(true);
  })
}

export {
  getRating,
  sendRating,
};