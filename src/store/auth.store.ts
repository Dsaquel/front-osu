import { defineStore } from 'pinia';
import apiAuth from '~/api/modules/api.auth';
import useUserStore from './user.store';

const useAuthStore = defineStore('auth', () => {
  async function siginIn(code: string) {
    const user = await apiAuth.signIn(code);

    useUserStore().user = user;
  }

  async function logout() {
    await apiAuth.logout();
  }

  return { siginIn, logout };
});

export default useAuthStore;
