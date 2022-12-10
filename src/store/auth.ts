import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import apiAuth from '~/api/modules/api.auth';

const useAuthStore = defineStore('auth', () => {
  async function siginIn(code: string) {
    const auth = await apiAuth.signIn(code);

    const { accessToken, ...auth } = auth;
    Cookies.
  }
  return { siginIn };
});

export default useAuthStore;
