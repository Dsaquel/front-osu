<script setup lang="ts">
import { User } from '~/types';
import vitecamp from '~/assets/svg/vitecamp.svg?component';

defineProps<{
  user?: User | null;
}>();
</script>

<template>
  <section display="flex" flex="col" justify="between" z="2" shadow="current sm" bg="green-500">
    <div>
      <div v-if="user" class="flex flex-col items-center pr-23px pt-50px pb-20px transition-all">
        <UserAvatar :src="user.avatarUrl" />
        <div>{{ user.username }}</div>
      </div>
      <div
        class="flex flex-col items-center pr-23px pt-50px pb-20px border-b-gray-400 border-r-orange-500 border-b-1px transition-all duration-150 hover:border-r-6px"
      >
        <div>toto</div>
        <div>toto</div>
      </div>
      <div>tata</div>
    </div>

    <vitecamp w="full" p="2" />
  </section>
</template>
