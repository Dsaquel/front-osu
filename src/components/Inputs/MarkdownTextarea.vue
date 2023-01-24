<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue';
import { isDark } from '~/utils/dark';

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

const emits = defineEmits(['update:description']);
input.value = props.text ?? '';

watch(input, () => {
  emits('update:description', input.value);
});
</script>

<template>
  <div grid="~ cols-2">
    <div grid="col-span-2">
      <Editor
        v-if="writing"
        v-model="input"
        :api-key="tinyApiKey"
        plugins="preview importcss searchreplace autolink directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons"
        toolbar="undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview print | insertfile image media template link anchor codesample | ltr rtl"
        :init="{
          min_height: 500,
          skin: isDark ? 'oxide-dark' : 'oxide',
          content_css: isDark ? 'dark' : 'default',
          menubar: 'file edit view insert format tools table help',
          toolbar_sticky: true,
          contextmenu: 'link image table',
        }"
      />
    </div>
  </div>
</template>
