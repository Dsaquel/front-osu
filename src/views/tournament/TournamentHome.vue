<script setup lang="ts">
const { user } = userStore();
</script>

<template>
  <div>
    <router-link class="bare" to="/tournaments/drafts/create">Create your tournament </router-link>
    <router-link v-if="user" class="bare" :to="`/users/${user.id}/tournaments`">See your drafts </router-link>
  </div>
</template>
