<script setup lang="ts">
import { User } from '~/types';

defineProps<{
  user?: User;
}>();
</script>

<template>
  <section>
    <UserAvatar v-if="user" :src="user.avatarUrl" />
    <p>toto</p>
    <p>tata</p>
  </section>
</template>
