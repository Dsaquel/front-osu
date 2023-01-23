<script setup lang="ts">
import 'tinymce/tinymce';
import 'tinymce/themes/silver';
import 'tinymce/icons/default';
import 'tinymce/skins/ui/oxide/skin.css';
// import 'tinymce/models/dom';
import 'tinymce/plugins/bbcode';
import 'tinymce/plugins/code';
import Editor from '@tinymce/tinymce-vue';

const tinyApiKey = import.meta.env.VITE_TINY_API_KEY;
const props = defineProps<{
  text: string | null;
}>();

const bbcode = computed(() => props.text);
</script>

<template>
  <Editor
    :model-value="bbcode"
    :api-key="tinyApiKey"
    height="500"
    :init="{
      plugins: 'preview bbcode code',
    }"
    :disabled="true"
  />
</template>
