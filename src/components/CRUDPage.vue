<template>
	<section padding class="crud">
		<p>CRUD Testing</p>
		<div l-flex>
			<ol>
				<li>
					<button @click="getAllUsers">Get all users</button>
				</li>
				<li>
					<button @click="saveUser" >Save user</button>
				</li>
				<li>
					<button @click="deleteUser">Delete user</button>
				</li>
				<li>
					<button @click="filterUSers">Filter users</button>
				</li>
				<li>
					<button @click="orderBy">Order by name</button>
				</li>
				<li>
				</li>
			</ol>
			<ol class="users">
				<span v-if="loading" text-center>Loading</span>
				<li v-else v-for="(user, index) in users" :key='`user-${index}`' :data-id="user.id" l-flex>
					<span font-bold margin-right>{{ user.name }}</span>
					<span>{{ user.email }}</span>
				</li>
			</ol>
		</div>
	</section>
</template>

<script>

export default {
	name: 'CRUDPage',
	data() {
		return {
			users: [],
			loading: false,
			mock: {
				names: [
					'Hector',
					'Jorge',
					'Luis',
					'Fernando',
					'Maria',
				],
				emails: [
					'hector@gmail.com',
					'jorge@gmail.com',
					'asdasd@gmail.com',
					'gfdgdfg@outlook.es',
					'nasdas@net.io',
				],
			}
		}
	},
	mounted() {
		//this.getAllUsers();
		db.collection('user').onSnapshot(snapshot => {
			let changes = snapshot.docChanges();
			console.log(changes);
			changes.forEach(change => {
				if (change.type === 'added') {
					const user = change.doc;
					this.users.push({
						id: user.id,
						name: user.data().name,
						email: user.data().email,
					});
				} else if (change.type === 'removed') {
					this.users = this.users.filter(user => {
						return user.id !== change.doc.id;
					});
				}
			});
		});
	},
	methods: {
		getAllUsers() {
			this.users = [];
			this.loading = true;
			db.collection('user').get().then((snapshot) => {
				snapshot.docs.forEach(user => {
					this.users.push({
						id: user.id,
						name: user.data().name,
						email: user.data().email,
					});
				});
				this.loading = false;
			});
		},
		saveUser() {
			const newUser = {
				name: this.mock.names[this.getRandomNumber(this.mock.names.length - 1)],
				email: this.mock.emails[this.getRandomNumber(this.mock.emails.length - 1)],
			};
			db.collection('user').add(newUser);
			//this.users.push(newUser); // (*)
			//this.getAllUsers(); // (*)
		},
		deleteUser() {
			const idUserToDelete = this.getRandomUser().id;
			db.collection('user').doc(idUserToDelete).delete().then(() => {
				//this.getAllUsers(); // (*)
			});
		},
		filterUSers() {
			this.loading = true;
			this.users = [];
			db.collection('user').where('name', '==', 'Hector').get().then((snapshot) => {
				snapshot.docs.forEach(user => {
					this.users.push({
						id: user.id,
						name: user.data().name,
						email: user.data().email,
					});
				});
				this.loading = false;
			});
		},
		orderBy() {
			this.loading = true;
			this.users = [];
			db.collection('user').where('name', '==', 'Hector').orderBy('email').get().then((snapshot) => {
				snapshot.docs.forEach(user => {
					this.users.push({
						id: user.id,
						name: user.data().name,
						email: user.data().email,
					});
				});
				this.loading = false;
			});
		},
		getRandomUser() {
			const indexRandom = this.getRandomNumber(this.users.length - 1);
			return this.users[indexRandom];
		},
		getRandomNumber(max, min = 0) {
			return Math.floor((Math.random() * max) + min);
		}
	},
};
// *: These are now in onSnapshot listener.
</script>
