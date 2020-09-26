import { DB } from './DataBase';
import { collectionPainting } from './PaintingRepository';

function calculateAverage(newRating, { numRatings, avgRating: oldAvgRating }) {
  const avgRating = isNaN(oldAvgRating) ? 1 : oldAvgRating;
  const newAverage = (numRatings * avgRating + newRating) / (numRatings + 1);
  console.log(newAverage);
  return newAverage;
}

async function getRating(currentPainting) {
  const documentRating = await collectionPainting.doc(currentPainting)
    .get();
  return documentRating.exists ? documentRating.data().avgRating : 1;
}

async function sendRating(currentPainting, rating) {
  const documentPainting = collectionPainting.doc(currentPainting);
  await DB.runTransaction(async transaction => {
    const doc = await transaction.get(documentPainting);
    if (!doc.exists) return Promise.reject(`Rating wasn't sent.`);
    const data = doc.data();
    console.log(data);
  
    const newAverage = calculateAverage(rating, data);
  
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