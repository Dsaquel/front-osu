<script setup lang="ts">
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const textContent = ref('');
const open = ref(true);
const text = computed(() => marked(DOMPurify.sanitize(textContent.value)));
</script>

<template>
  <div h="min-200px" grid="~ cols-2">
    <button p="2" border="1 gray-500">Write</button>
    <button p="2" border="1 gray-500">Preview</button>
    <div grid="col-span-2">
      <textarea v-if="open" v-model="textContent" resize="y" p="2" h="min-200px" w="full" v-bind="useAttrs()" />
      <div v-else v-html="text" />
    </div>
  </div>
</template>
