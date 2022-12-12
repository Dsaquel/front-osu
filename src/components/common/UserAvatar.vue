<script setup lang="ts">
defineProps<{
  src?: string;
}>();
</script>

<template>
  <img v-if="src" class="w-10 h-10 rounded-full" :src="src" />
  <i-mdi:loading v-else class="animate-spin h-10 w-10" />
</template>
