import { defineStore } from 'pinia';
import { Draft, User } from '~/types';
import apiUser from '~/api/modules/api.user';

const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const userDrafts = ref(undefined as Draft[] | undefined);

  function store(data: User) {
    user.value = { ...data };
  }

  async function fetch() {
    const data = await apiUser.fetch();
    store(data);
  }

  async function updateTournamentDraft(payload: Partial<User['tournamentDraft']>) {
    const stringify = JSON.stringify(payload);
    const data = await apiUser.updateTournamentDraft({ tournamentDraft: stringify });
    store(data);
  }

  async function fetchUserDrafts() {
    const data = await apiUser.fetchUserDrafts();
    userDrafts.value = data;
  }

  return { user, fetch, updateTournamentDraft, userDrafts, fetchUserDrafts };
});

export default useUserStore;
