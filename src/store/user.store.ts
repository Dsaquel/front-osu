import { defineStore } from 'pinia';
import { Draft, Tournament, User } from '~/types';
import apiUser from '~/api/modules/api.user';

const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const userDrafts = ref(undefined as Draft[] | undefined);
  const userInvolvement = ref(undefined as Tournament[] | undefined);

  function store(data: User) {
    user.value = { ...data };
  }

  async function fetch() {
    const data = await apiUser.fetch();
    data.id = 5;
    store(data);
  }

  async function fetchUserDrafts() {
    const data = await apiUser.fetchUserDrafts();
    userDrafts.value = data;
  }

  async function fetchUserInvolvement() {
    const data = await apiUser.fetchUserInvolvement();
    userInvolvement.value = data;
  }

  async function fetchUsersByUsername(username: string) {
    try {
      console.log(username);
      return await apiUser.fetchUsersByUsername(username);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  return { user, fetch, userDrafts, userInvolvement, fetchUserInvolvement, fetchUserDrafts, fetchUsersByUsername };
});

export default useUserStore;
