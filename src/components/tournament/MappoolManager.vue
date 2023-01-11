<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { Tournament } from '~/types';

const { mappools, fetchMappools, fetchMappoolQualifier } = mappoolStore();

const props = defineProps<{
  tournament: Tournament;
}>();
onBeforeMount(async () => {
  await fetchMappools(props.tournament.id);
  if (props.tournament.qualifier) await fetchMappoolQualifier(props.tournament.qualifier.id);
});
</script>

<template>
  {{ mappools || 'pas de mappools' }}
  <el-button display="block">+</el-button>

  <el-button display="block">-</el-button>
</template>
