<script setup lang="ts">
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Match } from '~/types';

dayjs.extend(LocalizedFormat);

const { access } = storeToRefs(tournamentStore());

const props = defineProps<{
  match: Match;
}>();
const { match } = toRefs(props); // TODO:  desactive refs after testing
const activeTab = ref('matchDetail');
</script>

<template>
  <el-dialog v-bind="useAttrs()" append-to-body align-center :show-close="false">
    <template #header>
      <div flex="~" justify="between">
        <div>Match {{ match.identifier }}</div>
        <div flex="~" align="items-center">
          <i-tabler:point-filled
            :class="{
              'text-red-600': match.state === 'playing',
              'text-green-500': match.state === 'complete',
              'text-orange-500': match.state === 'pending',
            }"
          />
          <span font="semibold">
            {{ match.state === 'playing' ? 'live' : match.state === 'complete' ? 'finished' : match.state }}
          </span>
        </div>
      </div>
    </template>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="Detail" name="matchDetail">
        <el-row justify="space-between">
          <el-col :span="10">
            <el-card shadow="never">
              <div flex="~" align="items-center" justify="between">
                <div flex="~ col" align="items-center">
                  <el-avatar size="large" :src="match.player1.user.avatarUrl" />
                  <span text="base">{{ match.player1.user.username }}</span>
                </div>
                <span text="3xl">{{ match.player1Score || 0 }}</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <div flex="~" align="items-center" h="full" justify="center">
              <span text="3xl">versus</span>
            </div>
          </el-col>
          <el-col :span="10">
            <el-card shadow="never">
              <div flex="~" align="items-center" justify="between">
                <span text="3xl">{{ match.player1Score || 0 }}</span>
                <div flex="~ col" align="items-center">
                  <el-avatar size="large" :src="match.player2.user.avatarUrl" />
                  <span text="base">{{ match.player2.user.username }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>

      <!-- voir quand est ce que le match commmence ainsi que les autres infos -->
      <!-- pouvoir edit le match "superReferee like" -->
      <!-- pouvoir reschedule -->
      <el-tab-pane v-if="access?.isAdmin || access?.isReferee || access?.isOwner" label="Update" name="matchUpdate">
        <MatchUpdate :match="match" />
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      {{ match.startDate ? 'schedule: ' + dayjs(match.startDate).format('LLLL') : 'unscheduled yet' }}
    </template>
  </el-dialog>
</template>
