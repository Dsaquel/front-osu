import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import apiAuth from '~/api/modules/api.auth';
import useUserStore from './user.store';

const useAuthStore = defineStore('auth', () => {
  async function siginIn(code: string) {
    const auth = await apiAuth.signIn(code);
    const { accessToken, ...user } = auth;

    useUserStore().user = user;

    Cookies.set('AccessToken', accessToken, { expires: 183 });
  }
  return { siginIn };
});

export default useAuthStore;
