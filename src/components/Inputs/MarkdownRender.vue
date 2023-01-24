<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue';
import { isDark } from '~/utils/dark';

const tinyApiKey = import.meta.env.VITE_TINY_API_KEY;
defineProps<{
  text: string | null;
}>();
</script>

<template>
  <Editor
    :initial-value="text"
    :api-key="tinyApiKey"
    :init="{
      plugins: 'autoresize ',
      toolbar: false,
      menubar: false,
      min_height: 500,
      readonly: true,
      statusbar: false,
      skin: isDark ? 'oxide-dark' : 'oxide',
      content_css: isDark ? 'dark' : 'default',
      content_style: isDark ? 'html { color-scheme: dark; }' : '',
    }"
    :disabled="true"
  />
</template>

<style scoped></style>
