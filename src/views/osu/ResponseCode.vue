<template>
  <h3>reponse d'osu</h3>
</template>

<script setup lang="ts">
import useAuthStore from '~/store/auth.store';

const authStore = useAuthStore();
onMounted(() => {
  authStore.siginIn(useRoute().query.code as string);
  useRouter().push('/');
});
</script>
