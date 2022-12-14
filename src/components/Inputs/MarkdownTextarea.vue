<script setup lang="ts">
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const writing = ref(true);

const { user, updateTournamentDraft } = userStore();

const { description } = { ...user?.tournamentDraft };

updateTournamentDraft();
const text = computed(() => marked(DOMPurify.sanitize(description ?? '')));

watch(
  () => description,
  () => {
    console.log('toto');
  },
);
</script>

<template>
  <div h="min-200px" grid="~ cols-2">
    <button p="2" border="1 gray-500" @click="writing = true">Write</button>
    <button p="2" border="1 gray-500" @click="writing = false">Preview</button>
    <div grid="col-span-2">
      <textarea v-if="writing" v-model="description" resize="y" p="2" h="min-200px" w="full" v-bind="useAttrs()" />
      <div v-else-if="text" h="min-200px" v-html="description" />
      <div v-else h="min-200px">Nothing to show</div>
    </div>
  </div>
</template>
