import { defineStore } from 'pinia';
import apiAuth from '~/api/modules/api.auth';

const useAuthStore = defineStore('auth', () => {
  function siginIn(code: string) {
    const user = apiAuth.signIn(code);
    console.log(user);
  }
  return { siginIn };
});

export default useAuthStore;
