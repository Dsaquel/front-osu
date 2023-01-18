<script setup lang="ts">
import { onBeforeMount } from 'vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Tournament, MapType } from '~/types';

dayjs.extend(utc);

const { fetchTournamentMappools, fetchQualifierMappool, updateTournamentMappool, deleteTournamentMappool } =
  mappoolStore();

const { qualifierMappool, tournamentMappools } = storeToRefs(mappoolStore());
const { deleteMap, refreshDataBeatmap } = mapStore();

const props = defineProps<{
  tournament: Tournament;
}>();

const activeCollapse = ref(['1']);
let isVisibleLoading = $ref(false);

const formattedType = {
  noMod: 'no mod',
  hidden: 'hidden',
  hardRock: 'hard rock',
  doubleTime: 'double time',
  freeMod: 'free mod',
  tieBreaker: 'tie breaker',
};

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

          <el-table :data="tournamentMappool.maps" row-key="id" :lazy="true" height="450">
            <el-table-column :width="200">
              <template #default="scope">
                <el-image :src="scope.row.osuBeatmap.beatmapset.covers.card"></el-image>
                <!-- {{ scope.row }} -->
              </template>
            </el-table-column>
            <el-table-column label="Beatmap title" :width="350">
              <template #default="scope">
                {{
                  `${scope.row.osuBeatmap.beatmapset.artist} - ${scope.row.osuBeatmap.beatmapset.title} [${scope.row.osuBeatmap.version}]`
                }}
              </template>
            </el-table-column>

            <el-table-column label="CS" :width="60">
              <template #default="scope">
                {{ scope.row.osuBeatmap.cs }}
              </template>
            </el-table-column>

            <el-table-column label="AR" :width="60">
              <template #default="scope"> {{ scope.row.osuBeatmap.ar }} </template>
            </el-table-column>

            <el-table-column label="stars">
              <template #default="scope"> {{ scope.row.osuBeatmap.difficulty_rating }} </template>
            </el-table-column>

            <el-table-column label="bpm">
              <template #default="scope"> {{ scope.row.osuBeatmap.bpm }} </template>
            </el-table-column>

            <el-table-column label="length">
              <template #default="scope">
                {{ dayjs().startOf('day').second(scope.row.osuBeatmap.total_length).format('m:s') }}
              </template>
            </el-table-column>

            <el-table-column label="mod">
              <template #default="scope">
                <el-tag disable-transitions>{{ formattedType[scope.row.type as MapType] }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column label="actions" align="center">
              <template #default="scope">
                <a :href="scope.row.osuBeatmap.url" target="_blank">
                  <el-button type="primary" size="small" link>osu page</el-button>
                </a>
                <el-button
                  type="danger"
                  size="small"
                  text
                  m="l-1"
                  @click="deleteMap(tournamentMappool.id, scope.row.id as number, 'tournament', tournament.id)"
                  >delete</el-button
                >
                <el-tooltip content="Refresh the beatmap data" placement="right">
                  <el-button
                    size="small"
                    plain
                    round
                    m="l-1"
                    @click="
                      refreshDataBeatmap(tournamentMappool.id, scope.row.id as number, 'tournament', tournament.id)
                    "
                    ><i-mdi:recycle />
                  </el-button>
                </el-tooltip>
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

.noMod {
  background: black;
}
// IDEA: for make bg alternate color
// need to put this on table
// :cell-class-name="
//               (e) =>
//                 e.columnIndex > 1 && e.columnIndex < 5
//                   ? `bg-${e.row.type}`
//                   : e.columnIndex === 7
//                   ? ''
//                   : `bg-${e.row.type}-light`
//             "
//             :row-class-name="(e) => `type ${e.row.type}`"
// :deep(.bg-hardRock) {
//   background: blue;
//   // &::before {
//   //   z-index: -1;
//   //   content: 'hard rock';
//   //   font-style: italic;
//   //   font-weight: 700;
//   //   color: #fff;
//   //   background: #e06666;
//   //   opacity: 0.3;
//   //   position: absolute;
//   // }
// }
// :deep(.bg-hardRock-light) {
//   background: red;
// }
// :deep(.type) {
//   // z index 5 on parent
//   position: relative;
//   overflow: hidden;
//   &::after {
//     z-index: 1;
//     font-weight: 700;
//     line-height: 1;
//     font-size: 50px;
//     color: #fff;
//     position: absolute;
//     left: 50%;
//     scale: 1.6;
//     transform: translate(0, 15%);
//     transform-origin: 150%;
//     overflow: hidden;
//   }
// }
// :deep(.hardRock:after) {
//   content: 'HR';
// }
</style>
