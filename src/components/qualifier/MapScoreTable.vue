<script lang="ts" setup>
import { QualifierMap, ParticipantMapScore } from '~/types';

defineProps<{
  mapScore: QualifierMap;
}>();

function getQualifierParticipantMapPlayed(row: ParticipantMapScore) {
  return row;
}
</script>

<template>
  <div>
    <el-image loading="lazy" :src="mapScore.osuBeatmap.beatmapset.covers['slimcover@2x']" />

    <el-table :data="mapScore.participantsMapPlayed">
      <el-table-column label="player">
        <template #default="scope">
          <div display="flex" align="items-center">
            <el-avatar :src="getQualifierParticipantMapPlayed(scope.row).participant.user.avatarUrl" />
            <span m="l-2" text="overflow-ellipsis space-nowrap" overflow="hidden">
              {{ getQualifierParticipantMapPlayed(scope.row).participant.user.username }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="score">
        <template #default="scope">
          {{
            getQualifierParticipantMapPlayed(scope.row)
              .score?.toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ' ') || 0
          }}
        </template>
      </el-table-column>
      <el-table-column label="point">
        <template #default="scope">
          {{ getQualifierParticipantMapPlayed(scope.row).rank }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
