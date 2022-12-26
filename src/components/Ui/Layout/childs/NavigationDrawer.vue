<script setup lang="ts">
import { User } from '~/types';
import vitecamp from '~/assets/svg/vitecamp.svg?component';

defineProps<{
  user?: User | null;
}>();
</script>

<template>
  <section display="flex" flex="col" justify="between" z="2" shadow="current sm" bg="green-500">
    <div class="<sm:flex <sm:justify-around">
      <router-link :to="`/users/${user?.id}`" class="nav">
        <i-mdi:account w="min-28px" m="b-7px" text="1.4rem" />
        <div class="<sm:hidden">Me</div>
      </router-link>
      <router-link to="/" class="nav">
        <i-mdi:house w="min-28px" m="b-7px" text="1.4rem" />
        <div class="<sm:hidden">Home</div>
      </router-link>
      <router-link to="/tournaments" class="nav">
        <i-mdi:tournament w="min-28px" m="b-7px" text="1.4rem" />
        <div class="<sm:hidden">Tournaments</div>
      </router-link>
    </div>

    <vitecamp class="<sm:hidden" w="full" p="2" />
  </section>
</template>
