import { defineStore } from 'pinia';
import { User } from '~/types';
import apiUser from '~/api/modules/api.user';

const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);

  function store(data: User) {
    console.log(data);
    user.value = { ...data };
  }

  async function fetch() {
    const data = await apiUser.fetch();
    store(data);
  }

  return { user, fetch };
});

export default useUserStore;
