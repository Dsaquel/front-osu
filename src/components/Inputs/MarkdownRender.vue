<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue';

const tinyApiKey = import.meta.env.VITE_TINY_API_KEY;
const props = defineProps<{
  text: string | null;
}>();

const bbcode = computed(() => props.text);
</script>

<template>
  <form method="post">
    <Editor
      v-model="bbcode"
      :api-key="tinyApiKey"
      :init="{
        plugins: 'preview bbcode',
        disabled: true,
        resize: 'false',
        selector: 'textarea#page-embed',
        toolbar: 'pageembed code preview',
        menubar: 'view',
        height: 500,
      }"
      :disabled="false"
    />
    <!-- <textarea id="bbcode" v-model="bbcode" resize="y" p="2" h="min-200px" w="full" border="1 red-200" /> -->
  </form>
  <!-- <div v-else h="min-200px" border="1 b-gray-400">Nothing to show</div> -->
</template>
