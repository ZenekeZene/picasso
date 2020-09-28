import { DB } from './DataBase';
export const collectionUsers = DB.collection('user');

async function orderByUser(orderDirection, users = []) {
  const snapshot = await collectionUsers.orderBy('name', orderDirection).get();
  snapshot.docs.map((user) => {
    users.push({
      id: user.id,
      name: user.data().name,
      email: user.data().email,
    });
  });
  return users;
}

async function updateUser(idUser, { name, email }) {
  await collectionUsers.doc(idUser).update({
    name,
    email,
  });
}

async function createUser(name, email) {
  const snapshot = await collectionUsers.add({ name, email });
  return {
    id: snapshot.id,
    name,
    email,
  };
}

async function removeUser(idUserToBeRemoved) {
  await collectionUsers.doc(idUserToBeRemoved).delete();
}

function onChangeUsers(users = []) {
  const handlerChanges = (snapshot) => {
    const changes = snapshot.docChanges();
    changes.map(({ type, doc: userChanged }) => {
      if (type === 'added') {
        users.push({
          id: userChanged.id,
          name: userChanged.data().name,
          email: userChanged.data().email,
        });
      } else if (type === 'removed') {
        const indexOfUserToBeRemoved = users.map(({ id }) => id).indexOf(userChanged.id);
        users.splice(indexOfUserToBeRemoved, 1);
      }
    });
  }
  collectionUsers.onSnapshot(handlerChanges);
}
export {
  orderByUser,
  updateUser,
  createUser,
  removeUser,
  onChangeUsers
}