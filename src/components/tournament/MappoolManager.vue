<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { Tournament } from '~/types';

const { mappools, fetchTournamentMappools, fetchQualifierMappool } = mappoolStore();

const props = defineProps<{
  tournament: Tournament;
}>();
onBeforeMount(async () => {
  await fetchTournamentMappools(props.tournament.id);
  if (props.tournament.qualifier) await fetchQualifierMappool(props.tournament.qualifier.id);
});
</script>

<template>
  {{ mappools || 'pas de mappools' }}
  <el-button display="block">+</el-button>

  <el-button display="block">-</el-button>
</template>
