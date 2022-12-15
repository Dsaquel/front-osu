<script setup lang="ts">
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import html2md from 'html-to-md';

const { updateTournamentDraft } = userStore();
const { user } = storeToRefs(userStore());

const { textarea, input } = useTextareaAutosize();

const writing = ref(true);

const description = computed(() => user.value?.tournamentDraft?.description);
const text = computed(() => marked(DOMPurify.sanitize(description.value ?? '')));

input.value = description.value ?? '';

const timeout = useTimeoutFn(
  () => {
    updateTournamentDraft({ description: input.value });
  },
  3000,
  { immediate: false },
);

watch(input, () => {
  timeout.start();
  if (input.value === html2md(text.value)) {
    timeout.stop();
    return;
  }
  if (timeout.isPending) {
    timeout.stop();
    timeout.start();
  }
});
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

      <div v-else-if="text" class="markdown" h="min-200px" v-html="text" />

      <div v-else h="min-200px">Nothing to show</div>
    </div>
  </div>
</template>
