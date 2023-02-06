<script lang="ts" setup>
import dayjs from 'dayjs';
import { MapType, TournamentMappool, QualifierMappool } from '~/types';

const { isAuthorized, access } = storeToRefs(tournamentStore());

defineProps<{
  mappool: TournamentMappool | QualifierMappool;
}>();

const { deleteMap, refreshDataBeatmap } = mapStore();

const formattedType = {
  noMod: 'no mod',
  hidden: 'hidden',
  hardRock: 'hard rock',
  doubleTime: 'double time',
  freeMod: 'free mod',
  tieBreaker: 'tie breaker',
};
</script>
<template>
  <el-table :data="mappool.maps" row-key="id" :lazy="true" height="max-content">
    <el-table-column :width="200">
      <template #default="scope">
        <el-image :src="scope.row.osuBeatmap.beatmapset.covers.card" loading="lazy" />
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
          v-if="isAuthorized && (access?.isAdmin || access?.isOwner || access?.isMappooler)"
          type="danger"
          size="small"
          text
          m="l-1"
          @click="
            deleteMap(
              mappool.id,
              scope.row.id as number,
              'tournamentId' in mappool ? 'tournament' : 'qualifier',
              'tournamentId' in mappool ? mappool.tournamentId : mappool.qualifierId,
            )
          "
        >
          delete
        </el-button>
        <el-tooltip
          v-if="isAuthorized && (access?.isAdmin || access?.isOwner || access?.isMappooler)"
          content="Refresh the beatmap data"
          placement="right"
        >
          <el-button
            size="small"
            plain
            round
            m="l-1"
            @click="
              refreshDataBeatmap(
                mappool.id,
                scope.row.id as number,
                'tournamentId' in mappool ? 'tournament' : 'qualifier',
                'tournamentId' in mappool ? mappool.tournamentId : mappool.qualifierId,
              )
            "
            ><i-mdi:recycle />
          </el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>

<style lang="scss" scoped>
:deep(.el-table_1_column_1) {
  padding: 0;
}
:deep(.el-table_1_column_1 div) {
  padding: 0;
}

.el-image {
  display: block;
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
