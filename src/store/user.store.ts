import { defineStore } from 'pinia';
import { User } from '~/types';
import apiUser from '~/api/modules/api.user';

const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);

  function store(data: User) {
    user.value = { ...data };
  }

  async function fetch() {
    const user = await apiUser.fetch();
    store(user);
  }

  async function updateTournamentDraft() {
    const user = await apiUser.updateTournamentDraft();
    store(user)
  }

  return { user, fetch, updateTournamentDraft };
});

export default useUserStore;
