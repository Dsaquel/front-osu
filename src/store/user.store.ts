import { defineStore } from 'pinia';
import { User } from '~/types';
import apiUser from '~/api/modules/api.user';

const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);

  function store(data: User) {
    user.value = { ...data };
  }

  async function fetch() {
    const data = await apiUser.fetch();
    const parsed = JSON.parse(data.tournamentDraft as string);
    data.tournamentDraft = parsed;
    store(data);
  }

  async function updateTournamentDraft(payload: { description: string }) {
    const stringify = JSON.stringify(payload);
    const data = await apiUser.updateTournamentDraft({ tournamentDraft: stringify });
    const parsed = JSON.parse(data.tournamentDraft as string);
    data.tournamentDraft = parsed;
    store(data);
  }

  return { user, fetch, updateTournamentDraft };
});

export default useUserStore;
