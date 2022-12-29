<script setup lang="ts">
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const props = defineProps<{
  text: string | null;
}>();
const text = computed(() => marked(DOMPurify.sanitize(props.text ?? '')));
</script>

<template>
  <div v-if="text" class="markdown" h="min-200px" border="b b-gray-500 opacity-60" v-html="text" />
  <div v-else h="min-200px" border="1 b-gray-400">Nothing to show</div>
</template>
