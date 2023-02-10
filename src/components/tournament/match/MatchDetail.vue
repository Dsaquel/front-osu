<script setup lang="ts">
import { Match } from '~/types';

defineProps<{
  match: Match;
}>();
</script>

<template>
  <el-dialog v-bind="useAttrs()" append-to-body>
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
          <div></div>
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
    <!-- voir quand est ce que le match commmence ainsi que les autres infos -->
    <!-- pouvoir edit le match "superReferee like" -->
    <!-- pouvoir reschedule -->

    <MatchUpdate :match="match" />
  </el-dialog>
</template>
