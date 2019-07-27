<template>
	<section padding class="crud">
		<div>
			<ol style="display: none;">
				<li>
					<button @click="getAllUsers">Get all users</button>
				</li>
				<li>
					<button @click="saveUser">Save user</button>
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
			<div l-flex>
				<ul class="paint__tools tools">
					<li class="crud-tools__item" :class="{ '--disabled': userSelected.name.length > 0 }" @click="launchCreateUser">
						<span class="icon-plus"></span>
					</li>
					<li class="crud-tools__item" :class="{ '--disabled': userSelected.name.length === 0 }" @click="launchEditUser">
						<span class="icon-write"></span>
					</li>
					<li class="crud-tools__item" :class="{ '--disabled': userSelected.name.length === 0 }" @click="deleteUser">
						<span class="icon-cross"></span>
					</li>
					<!--<li class="crud-tools__item" :class="{ '--disabled': userSelected.name.length > 0 || users.length < 3 }" @click="filterUSers">
						<span class="icon-filter"></span>
					</li>-->
					<li class="crud-tools__item" :class="{ '--disabled': userSelected.name.length > 0 || users.length < 3 }" @click="orderBy">
						<span class="icon-forward --down" :class="{ '--up': orderDirection === 'asc' }"></span>
					</li>
				</ul>
				<p v-if="loading" class="loading" text-center>Loading</p>
				<ol class="users" v-else>
					<transition-group name="fade" tag="li">
						<li
							class="users__item"
							v-for="(user, index) in users" 
							:key='`user-${index}`' 
							:data-id="user.id"
							:class="{ '--selected': userSelected && userSelected.id == user.id }"
							@click="handSelectUser(user)"
						>
							<span font-bold margin-right>{{ user.name }}</span>
							<span>{{ user.email }}</span>
						</li>
					</transition-group>
				</ol>
				<span class="button-mock icon-users" @click="mockData"></span>
			</div>
		</div>
		<modal-edit :user="userSelected" :action="action" @saveUser="saveUser" @updateUser="updateUser"></modal-edit>
	</section>
</template>

<script>
import ModalEdit from './ModalEdit';
import { mock } from '../mock.users.js';

export default {
	name: 'CRUDPage',
	components: {
		ModalEdit,
	},
	data() {
		return {
			users: [],
			loading: false,
			userSelected: {
				name: '',
				email: '',
			},
			action: 'create',
			orderDirection: 'desc',
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
	computed: {
		isDisabled() {
			return true;
		},
	},
	mounted() {
		//this.getAllUsers();
		db.collection('user').onSnapshot(snapshot => {
			let changes = snapshot.docChanges();
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
		handSelectUser(user) {
			if (this.userSelected !== user) {
				this.userSelected = user;
			} else {
				this.userSelected = {
					name: '',
					email: '',
				};
			}
		},
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
		launchCreateUser() {
			this.action = 'create';
			this.$modal.show('modal-edit');
		},
		saveUser(newUser) {
			this.userSelected = newUser;
			db.collection('user').add(newUser);
			this.$modal.hide('modal-edit');
			this.userSelected = {
				name: '',
				email: '',
			};
			//this.users.push(newUser); // (*)
			//this.getAllUsers(); // (*)
		},
		deleteUser() {
			const idUserToDelete = this.userSelected.id;
			db.collection('user').doc(idUserToDelete).delete().then(() => {
				//this.getAllUsers(); // (*)
				this.userSelected = {
					name: '',
					email: '',
				};
			});
		},
		launchEditUser() {
			this.action = 'update';
			this.$modal.show('modal-edit');
		},
		updateUser(user) {
			this.$modal.hide('modal-edit');
			db.collection('user').doc(this.userSelected.id).update({
				name: user.name,
				email: user.email,
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
			this.orderDirection = this.orderDirection === 'asc' ? 'desc' : 'asc';
			db.collection('user').orderBy('name', this.orderDirection).get().then((snapshot) => {
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
		},
		mockData() {
			mock.launch();
			this.userSelected = {
				name: '',
				email: '',
			};
		},
	},
};
// *: These are now in onSnapshot listener.
</script>
