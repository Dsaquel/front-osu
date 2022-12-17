<script setup lang="ts">
const { user } = userStore();
</script>

<template>
  <router-link class="bare" to="/tournaments/create">Create your tournament </router-link>
  <router-link v-if="user" class="bare" :to="`/users/${user.id}/tournaments/draft`">See your drafts </router-link>
</template>
