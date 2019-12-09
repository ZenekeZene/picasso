<template>
	<section class="p-crud" @click="blur">
		<ul class="tools">
			<li class="tools__item" :class="{ '--disabled': haveUserSelected || users.length === 0 }">
				<span class="icon-search" @click="goToSearch" v-mobile-hover:#4992a9></span>
			</li>
			<li class="tools__item" :class="{ '--disabled': haveUserSelected }">
				<span class="icon-plus" @click="launchCreateUser" v-mobile-hover:#4992a9></span>
			</li>
			<li class="tools__item" :class="{ '--disabled': haveNotUserSelected }">
				<span class="icon-write" @click="launchEditUser" v-mobile-hover:#4992a9></span>
			</li>
			<li class="tools__item" :class="{ '--disabled': haveNotUserSelected }">
				<span class="icon-cross" @click="launchDeleteUser" v-mobile-hover:#4992a9></span>
			</li>
			<li class="tools__item" :class="{ '--disabled': haveUserSelected || users.length === 0 }">
				<span class="icon-forward --down" @click="orderBy" :class="{ '--up': orderDirection === 'asc' }" v-mobile-hover:#4992a9></span>
			</li>
			<li class="tools__item --disabled" @click="mockData" v-mobile-hover:#4992a9>
				<span class="icon-rain"></span>
			</li>
		</ul>
		<transition name="fade" mode="out-in">
			<spinner-item class="loading" v-if="loading"></spinner-item>
			<div class="users-wrapper" v-else>
				<transition name="fade" mode="out-in">
					<p class="empty" v-if="users.length === 0">Aún no tienes usuarios. Prueba a crear uno.</p>
					<div class="users-search" v-else>
						<input type="text"
							class="search"
							:class="{ '--disabled': userSelected.name.length > 0 }"
							v-model="search"
							@focus="handSearchFocus"
							ref="search"
						/>
						<transition-group ref="usersList"
							name="fade" tag="ol"
							class="list"
							:class="{'--height-force': searchFocused}"
						>
							<li class="list__item"
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
					</div>
				</transition>
			</div>
		</transition>
		<transition name="fade">
			<span v-if="!searchFocused" class="button-bottom icon-forward --left" @click="$router.push('/')"></span>
		</transition>
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
import Vue from 'vue';
import scrollTo from '../../scrollTo';
import { mock } from '../../mock.users.js';
import ModalDelete from '../modals/ModalDelete';
import ModalEdit from '../modals/ModalEdit';
import SpinnerItem from '../SpinnerItem';

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
			userSelected: {
				name: '',
				email: '',
			},
			loading: false,
			action: 'create',
			search: '',
			orderDirection: 'desc',
			showSearch: false,
			searchFocused: false,
		};
	},
	computed: {
		filteredUsers() {
			return this.users.filter((user) => {
				return user.name.toLowerCase().includes(this.search.toLowerCase());
			});
		},
		haveNotUserSelected() {
			return this.userSelected.name.length === 0;
		},
		haveUserSelected() {
			return this.userSelected.name.length > 0;
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
		handSearchFocus() {
			this.searchFocused = true;
			this.resetUserSelected();
			this.$emit('inputFocused', true);
		},
		goToSearch() {
			this.$refs.search.focus();
		},
		scrollToEnd() {
			scrollTo(this.$refs.usersList.$el, this.$refs.usersList.$el.lastElementChild.offsetTop, 1000);
		},
		blur(event) {
			if (event.target.classList.contains('crud')) {
				this.resetUserSelected();
				this.searchFocused = false;
				this.$emit('inputFocused', false);
			}
		},
		handSelectUser(user) {
			if (this.haveNotUserSelected || this.userSelected.id !== user.id) {
				this.userSelected = user;
			} else {
				this.handSearchFocus();
			}
		},
		launchCreateUser(event) {
			if (this.haveNotUserSelected) {
				this.action = 'create';
				this.$modal.show('modal-edit');
			}
		},
		saveUser(newUser) {
			const result = window.db.collection('user').add(newUser).then((snapshot) => {
				this.userSelected = {
					name: newUser.name,
					email: newUser.email,
					id: snapshot.id,
				};
				this.$nextTick(() => this.scrollToEnd());
			});
			this.$modal.hide('modal-edit');
			this.$nextTick(() => this.scrollToEnd());
		},
		launchDeleteUser(event) {
			if (this.haveUserSelected) {
				this.$modal.show('modal-delete');
			}
		},
		deleteUser() {
			const idUserToDelete = this.userSelected.id;
			window.db.collection('user').doc(idUserToDelete).delete().then(() => {
				this.userSelected = this.users[this.users.length - 1];
				this.scrollToEnd();
			});
			this.$modal.hide('modal-delete');
		},
		launchEditUser(event) {
			if (this.haveUserSelected) {
				this.action = 'update';
				this.$modal.show('modal-edit');
			}
		},
		updateUser(user) {
			if (this.haveUserSelected) {
				this.$modal.hide('modal-edit');
				window.db.collection('user').doc(this.userSelected.id).update({
					name: user.name,
					email: user.email,
				});
			}
		},
		orderBy(event) {
			if (this.haveNotUserSelected && this.users.length > 0) {
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
</script>
