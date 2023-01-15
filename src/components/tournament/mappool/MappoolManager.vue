<script setup lang="ts">
import { onBeforeMount } from 'vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Tournament } from '~/types';

dayjs.extend(utc);

const { fetchTournamentMappools, fetchQualifierMappool, updateTournamentMappool, deleteTournamentMappool } =
  mappoolStore();
const { qualifierMappool, tournamentMappools } = storeToRefs(mappoolStore());

const props = defineProps<{
  tournament: Tournament;
}>();

const activeCollapse: number[] = [];
let isVisibleLoading = $ref(false);

onBeforeMount(async () => {
  await fetchTournamentMappools(props.tournament.id);
  if (props.tournament.qualifier) await fetchQualifierMappool(props.tournament.qualifier.id);
});

function deleteMappool(mappoolId: number) {
  deleteTournamentMappool(props.tournament.id, mappoolId);
}

async function updateDate(displayMappoolsSchedule: string, mappoolId: number) {
  await updateTournamentMappool(props.tournament.id, mappoolId, { displayMappoolsSchedule });
}

async function updateVisibility(isVisible: boolean, mappoolId: number) {
  isVisibleLoading = true;
  await updateTournamentMappool(props.tournament.id, mappoolId, { isVisible });
  isVisibleLoading = false;
}

watch([tournamentMappools, qualifierMappool], () => {
  const thImages = document.getElementsByClassName('image-label');
  Array.from(thImages).forEach((element) => {
    element.setAttribute('rowspan', '2');
  });
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
          <MapCreate :tournament-mappool="tournamentMappool" />
          <CommonDatepicker
            :model-value="tournamentMappool.displayMappoolsSchedule"
            :title="'Date where the mappool can be public'"
            :type="'datetime'"
            @update:model-value="(val) => (tournamentMappool.displayMappoolsSchedule = dayjs(val).utc().format())"
            @change="(val: string) => updateDate(dayjs(val).utc().format(), tournamentMappool.id)"
          />
          <el-switch
            v-model="tournamentMappool.isVisible"
            :loading="isVisibleLoading"
            @update:model-value="(val: boolean) => updateVisibility(val, tournamentMappool.id)"
          />
          <el-button type="danger" plain @click="deleteMappool(tournamentMappool.id)">Delete</el-button>

          <el-table
            :data="tournamentMappool.maps"
            height="250"
            :cell-class-name="
              (e) =>
                e.columnIndex > 1 && e.columnIndex < 5
                  ? `bg-${e.row.type}`
                  : e.columnIndex === 7
                  ? ''
                  : `bg-${e.row.type}-light`
            "
            :row-class-name="(e) => `type-${e.row.type}`"
          >
            <el-table-column :width="200">
              <template #default="scope">
                <el-image :src="scope.row.beatmap.beatmapset.covers.card"></el-image>
                <!-- {{ scope.row }} -->
              </template>
            </el-table-column>
            <el-table-column label="Beatmap title" :width="350">
              <template #default="scope">
                {{
                  `${scope.row.beatmap.beatmapset.artist} - ${scope.row.beatmap.beatmapset.title} [${scope.row.beatmap.version}]`
                }}
              </template>
            </el-table-column>
            <el-table-column label="CS" :width="60">
              <template #default="scope">
                {{ scope.row.beatmap.cs }}
              </template>
            </el-table-column>
            <el-table-column label="AR" :width="60">
              <template #default="scope"> {{ scope.row.beatmap.ar }} </template>
            </el-table-column>
            <el-table-column label="stars">
              <template #default="scope"> {{ scope.row.beatmap.difficulty_rating }} </template>
            </el-table-column>

            <el-table-column label="bpm">
              <template #default="scope"> {{ scope.row.beatmap.bpm }} </template>
            </el-table-column>
            <el-table-column label="length">
              <template #default="scope">
                {{ dayjs().startOf('day').second(scope.row.beatmap.total_length).format('m:s') }}
              </template>
            </el-table-column>
            <el-table-column label="actions">
              <template #default="scope">
                <el-button type="primary" size="small" link>osu page</el-button>
                <el-button type="danger" size="small" text m="l-1">Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <el-collapse-item v-if="qualifierMappool" title="Qualifier mappool">
          {{ qualifierMappool.isVisible }}
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-table_1_column_1) {
  padding: 0;
}
:deep(.el-table_1_column_1 div) {
  padding: 0;
}

.el-image {
  display: block;
}

:deep(.bg-hardRock) {
  background: blue;
  // &::before {
  //   z-index: -1;
  //   content: 'hard rock';
  //   font-style: italic;
  //   font-weight: 700;
  //   color: #fff;
  //   background: #e06666;
  //   opacity: 0.3;
  //   position: absolute;
  // }
}
:deep(.bg-hardRock-light) {
  background: red;
}
:deep(.type-hardRock) {
  // z index 5 on parent
  position: relative;
  overflow: hidden;
  &::after {
    z-index: 1;
    content: 'NM';
    font-weight: 700;
    line-height: 1;
    font-size: 50px;
    color: #fff;
    position: absolute;
    left: 50%;
    scale: 1.3;
    transform: translate(-15%, 15%) rotate(20deg);
    overflow: hidden;
  }
}
</style>
