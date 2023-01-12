<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { Tournament } from '~/types';

const { fetchTournamentMappools, fetchQualifierMappool } = mappoolStore();
const { qualifierMappool, tournamentMappools } = storeToRefs(mappoolStore());
const activeCollapse: number[] = [];

const props = defineProps<{
  tournament: Tournament;
}>();

onBeforeMount(async () => {
  await fetchTournamentMappools(props.tournament.id);
  if (props.tournament.qualifier) await fetchQualifierMappool(props.tournament.qualifier.id);
});
</script>

<template>
  <div class="card" m="t-2" p="4">
    <h2 text="center xl">Tournament mappools</h2>
    <div>
      <MappoolCreate :tournament="tournament" />

      <el-collapse v-model="activeCollapse">
        <el-collapse-item
          v-for="(tournamentMappool, i) in tournamentMappools"
          :key="i"
          :title="`Round ${tournamentMappool.round}`"
          :name="tournamentMappool.id"
        >
        </el-collapse-item>
        <el-collapse-item v-if="qualifierMappool" title="Qualifier mappool">
          {{ qualifierMappool.isVisible }}
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
  <!-- <el-button type="success" :icon="Plus" plain @click="showCreate = true" />
    <el-button type="danger" :icon="Minus" plain />
    <div v-if="showCreate">
      <el-input v-model="round" />
      <CommonDatepicker
        :model-value="tournament.startDate"
        :title="'show mappool'"
        :type="'datetime'"
        @update:model-value="(val) => (tournament!.startDate = dayjs(val).utc().format())"
      ></CommonDatepicker>
    </div>
  </div>
  <div v-if="qualifierMappool" class="card" m="t-2" p="4">
    <h2 text="center xl">Qualifier mappools</h2>
    <div>il y a une mappool qualifier</div>
  </div> -->
</template>
