<script setup lang="ts">
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import { Match } from '~/types';

dayjs.extend(utc);
dayjs.extend(LocalizedFormat);

const { access } = storeToRefs(tournamentStore());
const { user } = storeToRefs(userStore());
const { updateMatch, updateRescheduleMatch } = matchStore();

const props = defineProps<{
  match: Match;
}>();

const firstToOptions = [5, 6, 7];
const stateOptions = ['pending', 'playing', 'complete'];

const { match } = toRefs(props); // TODO:  desactive refs after testing
const activeTab = ref('matchDetail');

const firstToTemplate = ref(props.match.firstTo);
const player1ScoreTemplate = ref(props.match.player1Score);
const player2ScoreTemplate = ref(props.match.player2Score);
const matchesHistoryOsuTemplate = ref(props.match.matchesHistoryOsu);
const stateTemplate = ref(props.match.state);
const startDateTemplate = ref(props.match.startDate);
const rulesLobbyTemplate = ref(props.match.rulesLobby ?? '');
const rescheduleDate = ref('');
const shortMessage = ref<string>();
const showCreateReschedule = ref(false);
const isAcceptReschedule = ref<boolean>();

let cannotUpdateMatch = $ref(true);
let updateLoading = $ref(false);

watch(
  [
    firstToTemplate,
    player1ScoreTemplate,
    player2ScoreTemplate,
    matchesHistoryOsuTemplate,
    stateTemplate,
    startDateTemplate,
    rulesLobbyTemplate,
  ],
  () => {
    cannotUpdateMatch = false;
  },
  { immediate: false },
);

async function updateMatchTemplate() {
  try {
    updateLoading = true;
    await updateMatch(props.match.id, {
      firstTo: firstToTemplate.value,
      state: stateTemplate.value,
      startDate: startDateTemplate.value ?? undefined,
      rulesLobby: rulesLobbyTemplate.value ?? undefined,
      matchesHistoryOsu: matchesHistoryOsuTemplate.value ?? undefined,
      player1Score: player1ScoreTemplate.value ?? undefined,
      player2Score: player2ScoreTemplate.value ?? undefined,
    });
    ElMessage({ type: 'success', message: 'match updated', duration: 1000 });
  } catch (e) {
    ElMessage({ message: `error: ${e}`, duration: 1000 });
  } finally {
    updateLoading = false;
    cannotUpdateMatch = true;
  }
}

async function rescheduleMatchTemplate() {
  try {
    updateLoading = true;
    await updateRescheduleMatch(props.match.id, { shortMessage: shortMessage.value, schedule: rescheduleDate.value });
    ElMessage({ type: 'success', message: 'Reschedule request sent', duration: 1000 });
  } catch (e) {
    ElMessage({ type: 'error', message: 'error', duration: 1000 });
  } finally {
    shortMessage.value = '';
    rescheduleDate.value = '';
    updateLoading = false;
  }
}

function replyReschedule() {
  isAcceptReschedule.value = undefined;
  showCreateReschedule.value = true;
}
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

      <el-tab-pane v-if="access?.isAdmin || access?.isReferee || access?.isOwner" label="Update" name="matchUpdate">
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
                <el-option
                  v-for="(item, v) in firstToOptions"
                  :key="v"
                  :value="item"
                  :disabled="item === firstToTemplate"
                />
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
            <el-input
              v-model="rulesLobbyTemplate"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6 }"
              w="min-[80%]"
            />
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane
        v-if="
          access?.isAdmin ||
          access?.isReferee ||
          access?.isOwner ||
          match.player1Id === user?.id ||
          match.player2Id === user?.id
        "
        label="Reschedule"
        name="matchReschedule"
        :disabled="match.state === 'complete' || match.state === 'playing'"
      >
        <el-timeline v-if="match.reschedules.length > 0" p="2">
          <el-timeline-item
            v-for="(reschedule, index) in match.reschedules"
            :key="index"
            :timestamp="dayjs(reschedule.schedule).format('lll')"
            placement="top"
            :type="reschedule.isAccepted === null ? 'warning' : reschedule.isAccepted ? 'success' : 'danger'"
            size="large"
          >
            <div>
              {{ reschedule.shortMessage }}
            </div>
          </el-timeline-item>
          <el-timeline-item
            placement="top"
            :type="isAcceptReschedule ? 'success' : isAcceptReschedule === false ? 'danger' : 'info'"
          >
            <el-button-group>
              <el-tooltip content="reply with reschedule" placement="bottom">
                <el-button type="primary" @click="replyReschedule"><i-fluent-mdl2:calendar-reply /></el-button>
              </el-tooltip>
              <el-button type="primary" @click="isAcceptReschedule = true">accept reschedule</el-button>
              <el-button type="primary" @click="isAcceptReschedule = false">don't accept reschedule</el-button>
            </el-button-group>
            <el-card v-if="showCreateReschedule" shadow="never">
              <CommonDatepicker
                :model-value="rescheduleDate"
                type="datetime"
                title="reschedule"
                @update:model-value="(val) => (rescheduleDate = dayjs(val).utc().format())"
              />
              <div>
                <span display="block" text="xs">short message (if necessary)</span>
                <el-input v-model="shortMessage" type="textarea" :autosize="{ minRows: 2, maxRows: 3 }" w="max-250px" />
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <template v-if="activeTab === 'matchDetail'">
        {{ match.startDate ? 'schedule: ' + dayjs(match.startDate).format('LLLL') : 'unscheduled yet' }}
      </template>
      <template v-if="activeTab === 'matchUpdate'">
        <el-button type="success" :disabled="cannotUpdateMatch" :loading="updateLoading" @click="updateMatchTemplate"
          >Update
        </el-button>
      </template>
      <template v-if="activeTab === 'matchReschedule'">
        <el-button type="success" :disabled="!rescheduleDate" :loading="updateLoading" @click="rescheduleMatchTemplate"
          >Confirm
        </el-button>
      </template>
    </template>
  </el-dialog>
</template>
