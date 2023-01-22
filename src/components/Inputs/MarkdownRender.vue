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
    :api-key="tinyApiKey"
    height="500"
    :init="{
      // schema: 'html5',
      // menubar: false,
      // branding: false,
      plugins: 'preview bbcode code',
      toolbar: 'preview undo redo | bold italic underline | code',
    }"
    :disabled="false"
  />
  <!-- <textarea id="bbcode" v-model="bbcode" resize="y" p="2" h="min-200px" w="full" border="1 red-200" /> -->

  <!-- <div v-else h="min-200px" border="1 b-gray-400">Nothing to show</div> -->
</template>
