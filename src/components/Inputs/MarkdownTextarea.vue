<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text: string | null;
  }>(),
  {
    text: '',
  },
);

const { textarea, input } = useTextareaAutosize();

const writing = ref(true);

input.value = props.text ?? '';
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

      <MarkdownRender v-else :text="text" />
    </div>
  </div>
</template>
