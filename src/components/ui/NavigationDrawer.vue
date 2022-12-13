<script setup lang="ts">
import { User } from '~/types';

const open = ref(false);
defineProps<{
  user?: User;
}>();
</script>

<template>
  <UserAvatar v-if="user" :src="user.avatarUrl" />
</template>
