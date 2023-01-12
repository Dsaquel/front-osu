<script setup lang="ts">
import { onBeforeMount } from 'vue';
// import { Plus, Minus } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Tournament } from '~/types';

dayjs.extend(utc);

const { fetchTournamentMappools, fetchQualifierMappool } = mappoolStore();
const { qualifierMappool, tournamentMappools } = storeToRefs(mappoolStore());

const props = defineProps<{
  tournament: Tournament;
}>();

const showCreate = ref(false);
const rounds = ref([]);
const mappoolDateCreate = ref('');
const activeCollapse: number[] = [];

const roundOtions = computed(() => {
  if (!props.tournament.numbersPlayers) return undefined;
  let incrementations = 0;
  const res: number[] = [];
  for (let i = 1; i < props.tournament.numbersPlayers; i *= 2) {
    res.push((incrementations += 1));
  }
  res.push((incrementations += 1));
  // here delete all round where they are a mappool
  return res;
});

onBeforeMount(async () => {
  await fetchTournamentMappools(props.tournament.id);
  if (props.tournament.qualifier) await fetchQualifierMappool(props.tournament.qualifier.id);
});
</script>

<template>
  <div class="card" m="t-2" p="4">
    <h2 text="center xl">Tournament mappools</h2>
    <div>
      <el-button type="primary" text @click="showCreate = true">create new mappool</el-button>

      <el-dialog v-model="showCreate" title="Tips" w="3/10">
        <div display="grid" grid="cols-2 gap-2" justify="items-center">
          <div>
            <span display="block">Rounds</span>
            <el-select v-model="rounds" size="large" multiple collapse-tags>
              <el-option v-for="(item, i) in roundOtions" :key="i" :value="item" />
            </el-select>
          </div>
          <CommonDatepicker
            :model-value="mappoolDateCreate"
            :title="'Date where the mappool can be public'"
            :type="'datetime'"
            @update:model-value="(val) => (mappoolDateCreate = dayjs(val).utc().format())"
          />
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="showCreate = false">Cancel</el-button>
            <el-button type="primary" @click="showCreate = false"> Confirm </el-button>
          </span>
        </template>
      </el-dialog>

      <el-collapse v-model="activeCollapse">
        <el-collapse-item
          v-for="(tournamentMappool, i) in tournamentMappools"
          :key="i"
          :title="tournamentMappool.round"
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
