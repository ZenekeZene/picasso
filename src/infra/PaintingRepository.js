import { DB, STORAGE } from './DataBase';
export const collectionPainting = DB.collection('painting');

function getTimestamp() {
  return Math.floor(Date.now() / 1000);
}

async function getPaintings() {
  const paintings = [];
  const snapshot = await collectionPainting.get();
  snapshot.docs.map((doc) => paintings.push({ id: doc.id, ...doc.data() }));
  return paintings;
}

async function savePainting(paintingName, blob, history) {
  const metadata = { contentType: 'image/png' };
  const snapshot = await STORAGE.ref().child(`images/${getTimestamp()}`).put(blob, metadata);
  const url = await snapshot.ref.getDownloadURL();
  collectionPainting.add({
    name: paintingName,
    history: JSON.stringify(history),
    url,
    avgRating: 0,
    numRatings: 0,
    timestamp: new Date(),
  }); 
}

export {
  getPaintings,
  savePainting,
}