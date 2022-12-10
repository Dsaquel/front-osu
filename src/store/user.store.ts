import { defineStore } from 'pinia';
import { User } from '~/types';
import apiUser from '~/api/modules/api.user';

const useUserStore = defineStore('user', () => {
  let user = $ref<User | null>(null);

  function store(data: User) {
    user = { ...data };
  }

  async function fetch() {
    const data = await apiUser.fetch();
    store(data);
  }

  return { user, fetch };
});

export default useUserStore;
