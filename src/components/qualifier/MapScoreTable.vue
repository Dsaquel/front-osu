<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { QualifierMap, ParticipantMapScore, MapType } from '~/types';

defineProps<{
  mapScore: QualifierMap;
}>();

const { copy, copied } = useClipboard();

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
  <div>
    <div flex="~" justify="between" align="content-center">
      <el-tag size="large">{{ formattedType[mapScore.type as MapType] + ' ' + mapScore.numberOfType }}</el-tag>
      <div
        flex="~"
        align="content-center"
        :class="{ 'cursor-pointer': !copied }"
        @click="copy(mapScore.beatmapId.toString())"
      >
        {{ mapScore.beatmapId }}
        <i-material-symbols:content-copy-outline v-if="!copied" />
        <i-material-symbols:check-small v-else />
      </div>
    </div>
    <el-image loading="lazy" :src="mapScore.osuBeatmap.beatmapset.covers['slimcover@2x']" />
    <el-descriptions border>
      <el-descriptions-item label="average score">
        {{
          mapScore.participantsMapPlayed.map((map) => map.score).reduce((p, c) => p + c, 0) /
            mapScore.participantsMapPlayed.length || 'no score set yet'
        }}
      </el-descriptions-item>
    </el-descriptions>
    <el-table :data="mapScore.participantsMapPlayed">
      <el-table-column label="player">
        <template #default="scope: { row: ParticipantMapScore }">
          <div v-if="'user' in scope.row.participant" display="flex" align="items-center">
            <el-avatar :src="scope.row.participant.user.avatarUrl" />
            <span m="l-2" text="overflow-ellipsis space-nowrap" overflow="hidden">
              {{ scope.row.participant.user.username }}
            </span>
          </div>
          <div v-else>
            {{ scope.row.participant.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="score">
        <template #default="scope: { row: ParticipantMapScore }">
          {{ scope.row.score?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="point">
        <template #default="scope: { row: ParticipantMapScore }">
          {{ scope.row.rank }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
