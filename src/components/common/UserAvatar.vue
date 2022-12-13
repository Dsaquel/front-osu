<script setup lang="ts">
import vitecamp from '~/assets/svg/vitecamp.svg?component';

defineProps<{
  src?: string;
}>();
</script>

<template>
  <img v-if="src" v-bind="useAttrs()" class="rounded-full" w="10" h="10" :src="src" />
  <vitecamp v-else rounded />

  <!-- NOTE: SPIN BUTTON -->
  <!-- <i-mdi:loading v-else class="animate-spin h-10 w-10" /> -->
</template>
