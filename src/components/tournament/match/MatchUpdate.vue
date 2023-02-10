<script lang="ts" setup>
import { Match } from '~/types';

const firstToOptions = [5, 6, 7];
const props = defineProps<{
  match: Match;
}>();

const firstToTemplate = ref(props.match.firstTo);
const player1ScoreTemplate = ref(props.match.player1Score);
const player2ScoreTemplate = ref(props.match.player2Score);
</script>

<template>
  <div p="2" border="b-1 b-dark-50 opacity-60">
    <div text="lg center">Points</div>
    <div grid="~ cols-2" align="items-center">
      <div flex="~" align="items-center">
        <div flex="~ col" align="items-center" p="2">
          <el-avatar :src="match.player1.user.avatarUrl" />
          <span text="base">{{ match.player1.user.username }}</span>
        </div>
        <el-input-number v-model="player1ScoreTemplate" :min="0" :max="props.match.firstTo" />
      </div>

      <div justify="end" flex="~" align="items-center">
        <el-input-number v-model="player2ScoreTemplate" :min="0" :max="props.match.firstTo" />
        <div flex="~ col" align="items-center" p="2">
          <el-avatar :src="match.player2.user.avatarUrl" />
          <span text="base">{{ match.player2.user.username }}</span>
        </div>
      </div>
    </div>
  </div>

  <div grid="~ cols-3" m="t-4">
    <div>
      <span display="block" text="xs">first to</span>
      <el-select v-model="firstToTemplate" size="large" default-first-option filterable allow-create>
        <el-option-group label="first to" tag-type="success">
          <el-option v-for="(item, v) in firstToOptions" :key="v" :value="item" :disabled="item === firstToTemplate" />
        </el-option-group>
      </el-select>
    </div>
    <div>toto</div>
    <div>toto</div>
  </div>
</template>
