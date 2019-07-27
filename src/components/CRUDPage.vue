<template>
	<section padding class="crud">
		<p>CRUD Testing</p>
		<div l-flex>
			<ol>
				<li>
					<button @click="getAllUsers">Get all users</button>
					<button @click="saveUser" >Save user</button>
					<button @click="deleteUser">Delete user</button>
					<button @click="filterUSers">Filter users</button>
					<button></button>
				</li>
			</ol>
			<ol>
				<li v-for="(user, index) in users" :key='`user-${index}`' :data-id="user.id" l-flex>
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
		this.getAllUsers();
	},
	methods: {
		getAllUsers() {
			this.users = [];
			db.collection('user').get().then((snapshot) => {
				snapshot.docs.forEach(user => {
					this.users.push({
						id: user.id,
						name: user.data().name,
						email: user.data().email
					});
				});
			});
		},
		saveUser() {
			const newUser = {
				name: this.mock.names[this.getRandomNumber(this.mock.names.length - 1)],
				email: this.mock.emails[this.getRandomNumber(this.mock.emails.length - 1)],
			};
			db.collection('user').add(newUser);
			this.users.push(newUser);
			this.getAllUsers();
		},
		deleteUser() {
			const idUserToDelete = this.getRandomUser().id;
			db.collection('user').doc(idUserToDelete).delete().then(() => {
				this.getAllUsers();
			});
		},
		filterUSers() {
			db.collection('user').where('name', '==', 'Hector').get().then((snapshot) => {
				snapshot.docs.forEach(user => {
					console.log(user);
				});
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
</script>
