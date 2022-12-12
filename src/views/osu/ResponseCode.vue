<template>You can close this window</template>

<script setup lang="ts">
onMounted(() => {
  const code = useRoute().query.code as string;
  authStore().siginIn(code);
});
</script>
