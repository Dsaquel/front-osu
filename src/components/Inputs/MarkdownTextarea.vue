<script setup lang="ts">
import { marked } from 'marked';
import DOMPurify from 'dompurify';

defineProps<{
  details: string | null;
}>();

const { textarea, input } = useTextareaAutosize();

const writing = ref(true);
const text = computed(() => marked(DOMPurify.sanitize(details ?? '')));

input.value = details ?? '';
</script>

<template>
  <div h="min-200px" grid="~ cols-2">
    <button p="2" border="1 gray-500" @click="writing = true">Write</button>
    <button p="2" border="1 gray-500" @click="writing = false">Preview</button>
    <div grid="col-span-2">
      <textarea
        v-if="writing"
        ref="textarea"
        v-model="input"
        resize="y"
        p="2"
        h="min-200px"
        w="full"
        v-bind="useAttrs()"
      />

      <div v-else-if="text" class="markdown" h="min-200px" border="b b-gray-500 opacity-60" v-html="text" />

      <div v-else h="min-200px" border="1 b-gray-400">Nothing to show</div>
    </div>
  </div>
</template>
