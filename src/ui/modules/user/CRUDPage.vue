<template>
	<section class="p-crud" @click="blur">
		<ul class="tools">
			<li class="tools__item" :class="{ '--disabled': haveUserSelected || users.length === 0 }">
				<span class="icon-search" @click="goToSearch" v-mobile-hover:#4992a9></span>
			</li>
			<li class="tools__item" :class="{ '--disabled': haveUserSelected }">
				<span class="icon-plus" @click="handlerLaunchCreateUser" v-mobile-hover:#4992a9></span>
			</li>
			<li class="tools__item" :class="{ '--disabled': haveNotUserSelected }">
				<span class="icon-write" @click="handlerLaunchEditUser" v-mobile-hover:#4992a9></span>
			</li>
			<li class="tools__item" :class="{ '--disabled': haveNotUserSelected }">
				<span class="icon-cross" @click="handlerLaunchDeleteUser" v-mobile-hover:#4992a9></span>
			</li>
			<li class="tools__item" :class="{ '--disabled': haveUserSelected || users.length === 0 }">
				<span class="icon-forward --down" @click="hanlderOrderBy" :class="{ '--up': orderDirection === 'asc' }" v-mobile-hover:#4992a9></span>
			</li>
			<li class="tools__item --disabled" @click="mockData" v-mobile-hover:#4992a9>
				<span class="icon-rain"></span>
			</li>
		</ul>
		<transition name="fade" mode="out-in">
			<SpinnerItem class="loading" v-if="isLoading" />
			<div class="users-wrapper" v-else>
				<transition name="fade" mode="out-in">
					<p class="empty" v-if="users.length === 0 && !isLoading">{{ $t('users.empty') }}</p>
					<div class="users-search" v-else>
						<input type="text"
							class="search"
							:class="{ '--disabled': userSelected.name.length > 0 }"
							v-model="search"
							@focus="handlerSearchFocus"
							ref="search"
						/>
						<transition-group ref="usersList"
							name="fade" tag="ol"
							class="list list-users"
							:class="{ '--height-force': searchFocused }"
						>
							<li class="list__item"
								v-for="(user) in filteredUsers"
								:key="user.id"
								:data-id="user.id"
								:class="{ '--selected': userSelected && userSelected.id == user.id }"
								@click.stop="handlerSelectUser(user)"
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
			<span
				v-if="$route.meta.withBackArrow"
				class="back-arrow icon-forward --left"
				@click="$router.go(-1)"
			></span>
		</transition>
		<ModalDelete
			:user="userSelected"
			@delete-user="deleteUser"
		/>
		<ModalEdit
			:user="userSelected"
			:action="action"
			@save-user="saveUser"
			@update-user="updateUser"
		/>
	</section>
</template>

<script>
import Vue from 'vue';
import scrollTo from '@/scrollTo';
import { mock } from './mock.users.js';
import ModalDelete from '@/ui/components/modals/ModalDelete';
import ModalEdit from '@/ui/components/modals/ModalEdit';
import { orderByUser, updateUser, createUser, removeUser, onChangeUsers } from '@/infra/UserRepository';

export default {
	name: 'CRUDPage',
	components: {
		ModalDelete,
		ModalEdit,
	},
	data() {
		return {
			users: [],
			userSelected: {
				name: '',
				email: '',
			},
			isLoading: true,
			action: 'create',
			search: '',
			orderDirection: 'desc',
			showSearch: false,
			searchFocused: false,
		};
	},
	computed: {
		filteredUsers() {
			return this.users.filter(({ name }) => {
				return name.toLowerCase().includes(this.search.toLowerCase());
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
		try {
			onChangeUsers(this.users);
		} catch (error) {
			showError(error);
		} finally {
			this.isLoading = false;
		}
	},
	methods: {
		handlerSearchFocus() {
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
		handlerSelectUser(user) {
			if (this.haveNotUserSelected || this.userSelected.id !== user.id) {
				this.userSelected = user;
			} else {
				this.handSearchFocus();
			}
		},
		handlerLaunchCreateUser(event) {
			if (this.haveNotUserSelected) {
				this.action = 'create';
				this.$modal.show('modal-edit');
			}
		},
		saveUser({ name, email }) {
			try {
				createUser(name, email);
				this.$nextTick(() => this.scrollToEnd());
			} catch (error) {
				showError(error);
			} finally {
				this.$modal.hide('modal-edit');
			}
		},
		handlerLaunchDeleteUser(event) {
			if (this.haveUserSelected) {
				this.$modal.show('modal-delete');
			}
		},
		async deleteUser() {
			try {
				await removeUser(this.userSelected.id);
				this.userSelected = this.users[this.users.length - 1];
				this.scrollToEnd();
			} catch (error) {
				showError(error);
			} finally {
				this.$modal.hide('modal-delete');
			}
		},
		handlerLaunchEditUser(event) {
			if (this.haveUserSelected) {
				this.action = 'update';
				this.$modal.show('modal-edit');
			}
		},
		updateUser(user) {
			try {
				if (!this.haveUserSelected) return;
				updateUser(this.userSelected.id, { name: user.name, email: user.email });
			} catch (error) {
				showError(error);
			} finally {
				this.$modal.hide('modal-edit');
			}
		},
		async hanlderOrderBy(event) {
			if (this.haveUserSelected || !this.users.length > 0) return;
			this.isLoading = true;
			this.orderDirection = this.orderDirection === 'asc' ? 'desc' : 'asc';
			try {
				this.users = await orderByUser(this.orderDirection);
			} catch (error) {
				showError(error);
			} finally {
				this.isLoading = false;
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
<style lang="scss" scoped>
.list-users {
	max-height: 93%;
	overflow-y: auto;
}

.back-arrow {
	position: absolute;
	bottom: 1rem;
	left: 1rem;
}
</style>