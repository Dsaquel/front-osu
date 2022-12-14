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
      <router-link to="/" class="nav">
        <i-mdi:house w="min-28px" m="b-7px" text="1.4rem" />
        <div>Home</div>
      </router-link>
      <router-link to="/tournaments" class="nav">
        <i-mdi:tournament w="min-28px" m="b-7px" text="1.4rem" />
        <div>Tournaments</div>
      </router-link>
    </div>

    <div>
      <vitecamp w="full" p="2" />
    </div>
  </section>
</template>
