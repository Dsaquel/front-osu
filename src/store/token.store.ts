import { defineStore } from 'pinia';

const useTokenStore = defineStore('token', () => {
  const token = $ref<string>();

  return { token };
});

export default useTokenStore;
