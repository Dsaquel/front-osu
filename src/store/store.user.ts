import { defineStore } from 'pinia';
import { User } from '~/types';
import apiUser from '~/api/modules/api.user';

const useUserStore = defineStore('user', () => {
  const user = $ref<User>();

  async function fetch(): Promise<User> {
    return await apiUser.fetch();
  }
  return { user, fetch };
});

export default useUserStore;
