<script setup lang="ts">
import 'tinymce/tinymce';
import 'tinymce/themes/silver';
import 'tinymce/icons/default';
import 'tinymce/skins/ui/oxide/skin.css';
// import 'tinymce/models/dom';
import 'tinymce/plugins/bbcode';
import 'tinymce/plugins/code';
import Editor from '@tinymce/tinymce-vue';

const props = withDefaults(
  defineProps<{
    text: string | null;
  }>(),
  {
    text: '',
  },
);

const tinyApiKey = import.meta.env.VITE_TINY_API_KEY;

const { input } = useTextareaAutosize();

const writing = ref(true);
defineEmits(['update:description']);
input.value = props.text ?? '';
</script>

<template>
  <div h="min-200px" grid="~ cols-2">
    <div grid="col-span-2">
      <Editor
        v-if="writing"
        key="1"
        v-model="input"
        :api-key="tinyApiKey"
        height="500"
        :init="{
          plugins: 'preview bbcode code',
          toolbar: 'preview undo redo | bold italic underline | code',
        }"
      />
    </div>
  </div>
</template>
