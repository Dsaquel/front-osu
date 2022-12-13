<script setup lang="ts">
import { User } from '~/types';

defineProps<{
  user?: User | null;
}>();
</script>

<template>
  <section bg="green-500">
    <UserAvatar v-if="user" :src="user.avatarUrl" />
    <p>toto</p>
    <p>tata</p>
  </section>
</template>
