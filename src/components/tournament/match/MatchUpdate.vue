<script lang="ts" setup>
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import CommonDatepicker from '~/components/Common/CommonDatepicker.vue';

import { Match } from '~/types';

dayjs.extend(utc);

const props = defineProps<{
  match: Match;
}>();

const firstToOptions = [5, 6, 7];
const stateOptions = ['pending', 'playing', 'complete'];

const firstToTemplate = $ref(props.match.firstTo);
const player1ScoreTemplate = $ref(props.match.player1Score);
const player2ScoreTemplate = $ref(props.match.player2Score);
const matchesHistoryOsuTemplate = $ref(props.match.matchesHistoryOsu);
const stateTemplate = $ref(props.match.state);
const startDateTemplate = $ref(props.match.startDate);
const rulesLobbyTemplate = $ref(props.match.rulesLobby ?? '');
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

  <div grid="~ cols-4 gap-3" m="t-4">
    <div>
      <span display="block" text="xs">first to</span>
      <el-select v-model="firstToTemplate" filterable allow-create>
        <el-option-group label="first to" tag-type="success">
          <el-option v-for="(item, v) in firstToOptions" :key="v" :value="item" :disabled="item === firstToTemplate" />
        </el-option-group>
      </el-select>
    </div>
    <div>
      <span display="block" text="xs">matches history link</span>
      <el-input v-model="matchesHistoryOsuTemplate" />
    </div>
    <div>
      <span display="block" text="xs">state of match</span>
      <el-select v-model="stateTemplate">
        <el-option v-for="(item, v) in stateOptions" :key="v" :value="item" :disabled="item === stateTemplate" />
      </el-select>
    </div>

    <CommonDatepicker
      :model-value="startDateTemplate"
      type="datetime"
      title="start of match"
      @update:model-value="(val) => (startDateTemplate = dayjs(val).utc().format())"
    />
    <div grid="col-span-4" justify="self-center" class="sm:w-min-80">
      <span display="block" text="sm">rules lobby (if exist)</span>
      <el-input v-model="rulesLobbyTemplate" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" w="min-[80%]" />
    </div>
  </div>
</template>
