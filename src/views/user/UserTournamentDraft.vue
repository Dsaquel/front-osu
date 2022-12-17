<script setup lang="ts">
const { fetch, tournaments } = tournamentDraftStore();

onBeforeMount(() => fetch());
</script>

<template>user tournament draft</template>
