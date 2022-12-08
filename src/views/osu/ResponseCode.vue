<template>
  <h3>reponse d'osu</h3>
</template>

<script setup lang="ts">
import useAuthStore from '~/store/auth';

const authStore = useAuthStore();
onMounted(() => {
  authStore.siginIn(useRoute().query.code as string);
});
</script>
