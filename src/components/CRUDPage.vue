<template>
	<section class="crud" @click="blur">
		<ul class="tools --left">
			<li class="tools__item"
				:class="{ '--disabled': userSelected.name.length > 0 }"
			>
				<span class="icon-search" @click="showSearch = true" v-mobile-hover:#4992a9></span>
			</li>
			<li class="tools__item"
				:class="{ '--disabled': userSelected.name.length > 0 }"
			>
				<span class="icon-plus" @click="launchCreateUser" v-mobile-hover:#4992a9></span>
			</li>
			<li class="tools__item"
				:class="{ '--disabled': userSelected.name.length === 0 }"
			>
				<span class="icon-write" @click="launchEditUser" v-mobile-hover:#4992a9></span>
			</li>
			<li class="tools__item"
				:class="{ '--disabled': userSelected.name.length === 0 }"
			>
				<span class="icon-cross" @click="launchDeleteUser" v-mobile-hover:#4992a9></span>
			</li>
			<!--<li class="tools__item"
				:class="{ '--disabled': userSelected.name.length > 0 || users.length < 3 }"
				@click="filterUSers"
			>
				<span class="icon-filter"></span>
			</li>-->
			<li class="tools__item"
				:class="{ '--disabled': userSelected.name.length > 0 || users.length < 3 }"
			>
				<span class="icon-forward --down"
					:class="{ '--up': orderDirection === 'asc' }"
					@click="orderBy"
					v-mobile-hover:#4992a9
				></span>
			</li>
			<li class="tools__item --disabled" @click="mockData" v-mobile-hover:#4992a9>
				<span class="icon-rain"></span>
			</li>
		</ul>
		<input type="text" class="search" :class="{ '--disabled': userSelected.name.length > 0 }" v-model="search" @focus="resetUserSelected" v-if="!loading" />
		<spinner-item class="loading" v-if="loading"></spinner-item>
		<transition-group name="fade" tag="ol"  class="users" v-else>
			<li
				class="users__item"
				v-for="(user) in filteredUsers"
				:key="user.id"
				:data-id="user.id"
				:class="{ '--selected': userSelected && userSelected.id == user.id }"
				@click.stop="handSelectUser(user)"
			>
				<span font-bold margin-right>{{ user.name }}</span>
				<span>{{ user.email }}</span>
			</li>
		</transition-group>
		<span class="button-bottom icon-forward --left" @click="$router.push('/')"></span>
		<modal-delete
			:user="userSelected"
			@deleteUser="deleteUser"
		></modal-delete>
		<modal-edit
			:user="userSelected"
			:action="action"
			@saveUser="saveUser"
			@updateUser="updateUser"
		></modal-edit>
	</section>
</template>

<script>
import ModalDelete from './ModalDelete';
import ModalEdit from './ModalEdit';
import SpinnerItem from './SpinnerItem';
import { mock } from '../mock.users.js';
import Vue from 'vue';

export default {
	name: 'CRUDPage',
	components: {
		ModalEdit,
		ModalDelete,
		SpinnerItem,
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
			search: '',
			orderDirection: 'desc',
			showSearch: false,
		};
	},
	computed: {
		filteredUsers() {
			return this.users.filter((user) => {
				return user.name.toLowerCase().includes(this.search.toLowerCase());
			});
		},
	},
	mounted() {
		window.db.collection('user').onSnapshot((snapshot) => {
			const changes = snapshot.docChanges();
			changes.forEach((change) => {
				if (change.type === 'added') {
					const user = change.doc;
					this.users.push({
						id: user.id,
						name: user.data().name,
						email: user.data().email,
					});
				} else if (change.type === 'removed') {
					this.users = this.users.filter(user => user.id !== change.doc.id);
				}
			});
		});
	},
	methods: {
		blur(event) {
			if (event.target.classList.contains('crud')) {
				this.userSelected = {
					name: '',
					email: '',
				};
			}
		},
		handSelectUser(user) {
			if (this.userSelected.name.length === 0 || this.userSelected.id !== user.id) {
				this.userSelected = user;
			} else {
				this.resetUserSelected();
			}
		},
		getAllUsers() {
			this.users = [];
			this.loading = true;
			window.db.collection('user').get().then((snapshot) => {
				snapshot.docs.forEach((user) => {
					this.users.push({
						id: user.id,
						name: user.data().name,
						email: user.data().email,
					});
				});
				this.loading = false;
			});
		},
		launchCreateUser(event) {
			if (this.userSelected.name.length === 0) {
				console.log(event);
				this.action = 'create';
				this.$modal.show('modal-edit');
			}
		},
		saveUser(newUser) {
			this.userSelected = newUser;
			window.db.collection('user').add(newUser);
			this.$modal.hide('modal-edit');
			this.resetUserSelected();
			// this.users.push(newUser); // (*)
			// this.getAllUsers(); // (*)
		},
		launchDeleteUser(event) {
			if (this.userSelected.name.length > 0) {
				this.$modal.show('modal-delete');
			}
		},
		deleteUser() {
			const idUserToDelete = this.userSelected.id;
			window.db.collection('user').doc(idUserToDelete).delete().then(() => {
				// this.getAllUsers(); // (*)
				this.userSelected = this.users[this.users.length - 1];
			});
			this.$modal.hide('modal-delete');
		},
		launchEditUser(event) {
			if (this.userSelected.name.length > 0) {
				this.action = 'update';
				this.$modal.show('modal-edit');
			}
		},
		updateUser(user) {
			if (this.userSelected.name.length > 0) {
				this.$modal.hide('modal-edit');
				window.db.collection('user').doc(this.userSelected.id).update({
					name: user.name,
					email: user.email,
				});
			}
		},
		filterUSers() {
			this.loading = true;
			this.users = [];
			window.db.collection('user').where('name', '==', 'Hector').get().then((snapshot) => {
				snapshot.docs.forEach((user) => {
					this.users.push({
						id: user.id,
						name: user.data().name,
						email: user.data().email,
					});
				});
				this.loading = false;
			});
		},
		orderBy(event) {
			if (this.userSelected.name.length === 0 && this.users.length > 3) {
				this.loading = true;
				this.users = [];
				this.orderDirection = this.orderDirection === 'asc' ? 'desc' : 'asc';
				window.db.collection('user').orderBy('name', this.orderDirection).get().then((snapshot) => {
					snapshot.docs.forEach((user) => {
						this.users.push({
							id: user.id,
							name: user.data().name,
							email: user.data().email,
						});
					});
					this.loading = false;
				});
			}
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
			this.resetUserSelected();
		},
		resetUserSelected() {
			this.userSelected = {
				name: '',
				email: '',
			};
		},
	},
};
// *: These are now in onSnapshot listener.
</script>
