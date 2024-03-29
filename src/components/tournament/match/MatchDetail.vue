<script setup lang="ts">
import 'element-plus/es/components/message-box/style/css';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import { ElMessageBox } from 'element-plus';
import { Match, ParticipantIndividual, ParticipantTeam, TournamentType } from '~/types';

dayjs.extend(utc);
dayjs.extend(LocalizedFormat);

const { access, tournament, isOwnerOrAdmin } = storeToRefs(tournamentStore());
const { user } = storeToRefs(userStore());
const { updateMatch, createRescheduleMatch, joinMatchAsReferee, undoMatchReferee } = matchStore();

const props = defineProps<{
  match: Match;
}>();

const firstToOptions = [5, 6, 7];
const stateOptions = ['pending', 'playing', 'complete'];

const { match } = toRefs(props); // TODO:  desactive refs after testing, pas utilisé parce que match dans props
const activeTab = ref('matchDetail');

const firstToTemplate = ref(props.match.firstTo);
const player1ScoreTemplate = ref(props.match.player1Score);
const player2ScoreTemplate = ref(props.match.player2Score);
const matchesHistoryOsuTemplate = ref(props.match.matchesHistoryOsu);
const stateTemplate = ref(props.match.state);
const startDateTemplate = ref(props.match.startDate);
const rulesLobbyTemplate = ref(props.match.rulesLobby ?? '');
const rescheduleDate = ref<string>();
const shortMessage = ref<string>();
const showCreateReschedule = ref(false);
const statusNewReschedule = ref<'request' | 'accepted' | 'refused'>('request');
const formsError = ref<string>();

let updateLoading = $ref(false);

function getPlayerProprety(
  participant: ParticipantIndividual | ParticipantTeam | null,
  proprety: 'username' | 'avatarUrl',
) {
  if (!participant) return '';
  if ('user' in participant) {
    return participant.user[proprety];
  }
  return participant.captain[proprety];
}

async function updateMatchTemplate() {
  try {
    if (
      (player1ScoreTemplate.value === firstToTemplate.value || player2ScoreTemplate.value === firstToTemplate.value) &&
      (props.match.player1Score !== player1ScoreTemplate.value ||
        props.match.player2Score !== player2ScoreTemplate.value)
    ) {
      await ElMessageBox.confirm(
        `${
          player1ScoreTemplate.value === firstToTemplate.value
            ? (props.match.player1 as ParticipantIndividual)?.user?.username ||
              (props.match.player1 as ParticipantTeam)?.name
            : (props.match.player2 as ParticipantIndividual)?.user?.username ||
              (props.match.player2 as ParticipantTeam)?.name
        } will be the winner of the match`,
        'Warning',
        {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning',
        },
      );
    }
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
    ElMessage({ message: e as never, duration: 1000 });
  } finally {
    updateLoading = false;
    formsError.value = undefined;
  }
}

async function rescheduleMatchTemplate() {
  try {
    updateLoading = true;
    if (statusNewReschedule.value === 'accepted' || statusNewReschedule.value === 'refused') {
      shortMessage.value = statusNewReschedule.value === 'accepted' ? 'Accept to reschedule' : 'Refuse to reschedule';
    }
    if (!shortMessage.value) {
      shortMessage.value = 'has request';
    }
    await createRescheduleMatch(props.match.id, {
      shortMessage: shortMessage.value,
      schedule: rescheduleDate.value,
      status: statusNewReschedule.value,
    });
  } catch (e) {
    ElMessage({ type: 'error', message: 'error', duration: 1000 });
  } finally {
    shortMessage.value = undefined;
    rescheduleDate.value = undefined;
    statusNewReschedule.value = 'request';
    updateLoading = false;
  }
}

function replyReschedule(status: typeof statusNewReschedule.value, createReschedule: boolean) {
  statusNewReschedule.value = status;
  showCreateReschedule.value = createReschedule;
  if (status === 'accepted' || status === 'refused') {
    rescheduleDate.value = undefined;
  }
}

function getDateString(date: string) {
  if (dayjs(date).format('lll') === 'Invalid Date') {
    rescheduleDate.value = undefined;
    return undefined;
  }
  return dayjs(date).format('lll');
}

function getInfoMessageReschedule() {
  if (!match.value) return undefined;
  const participant = [match.value.player1, match.value.player2].find(
    (p) => p?.id !== match.value?.reschedules.at(-1)?.playerId,
  );
  if (!participant) return undefined;
  return `waiting ${'user' in participant ? participant.user.username : participant?.captain.username}`;
}

const canReschedule = computed(() => {
  if (!user.value) return false;
  if (isOwnerOrAdmin.value || access.value?.isReferee) {
    if (match.value?.reschedules.at(-1)?.status === 'accepted') return true;
    return false;
  }
  return user.value.id !== match.value?.reschedules.at(-1)?.playerId;
});

const isCaptainOrOwnPlayer = computed(
  () =>
    (match.value.player1 &&
      (('user' in match.value.player1 && match.value.player1.user.id === user.value?.id) ||
        ('captain' in match.value.player1 && match.value.player1.captain.id === user.value?.id))) ||
    (match.value.player2 &&
      (('user' in match.value.player2 && match.value.player2.user.id === user.value?.id) ||
        ('captain' in match.value.player2 && match.value.player2.captain.id === user.value?.id))),
);
</script>

<template>
  <el-dialog v-bind="useAttrs()" append-to-body align-center :show-close="false">
    <template #header>
      <div flex="~" justify="between">
        <div flex="~ col">
          <div>Match {{ match.identifier }}</div>
          <div text="gray-500 sm">first to {{ match.firstTo }}</div>
        </div>
        <div flex="~ col" align="items-end">
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
          <a
            v-if="match.matchesHistoryOsu && match.state !== 'pending'"
            class="text-gray-500 text-sm"
            :href="match.matchesHistoryOsu"
            >link</a
          >
        </div>
      </div>
    </template>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="Detail" name="matchDetail">
        <el-row justify="space-between">
          <el-col :span="9">
            <el-card v-if="match.player1" shadow="never">
              <div flex="~" align="items-center" justify="between">
                <div flex="~ col" align="items-center">
                  <el-avatar v-if="'user' in match.player1" size="large" :src="match.player1.user.avatarUrl" />
                  <span v-if="'user' in match.player1" text="base">{{ match.player1.user.username }}</span>
                  <span v-else text="base">{{ match.player1.name }}</span>
                </div>
                <span :class="{ 'text-emerald-500': match.winnerId === match?.player1.id }" text="3xl">{{
                  match.player1Score
                }}</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <div flex="~" align="items-center" h="full" justify="center">
              <span text="3xl">versus</span>
            </div>
          </el-col>
          <el-col :span="9">
            <el-card v-if="match.player2" shadow="never">
              <div flex="~" align="items-center" justify="between">
                <span :class="{ 'text-emerald-500': match.winnerId === match?.player2.id }" text="3xl">{{
                  match.player2Score
                }}</span>
                <div flex="~ col" align="items-center">
                  <el-avatar v-if="'user' in match.player2" size="large" :src="match.player2.user.avatarUrl" />
                  <span v-if="'user' in match.player2" text="base">{{ match.player2.user.username }}</span>
                  <span v-else text="base">{{ match.player2.name }}</span>
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
              <div v-if="match.player1" flex="~ col" align="items-center" p="2">
                <el-avatar v-if="'user' in match.player1" size="large" :src="match.player1.user.avatarUrl" />
                <span v-if="'user' in match.player1" text="base">{{ match.player1.user.username }}</span>
                <span v-else text="base">{{ match.player1.name }}</span>
              </div>
              <el-input-number
                v-model="player1ScoreTemplate"
                :disabled="match.state === 'complete'"
                :min="0"
                :max="props.match.firstTo"
              />
            </div>

            <div v-if="match.player2" justify="end" flex="~" align="items-center">
              <el-input-number
                v-model="player2ScoreTemplate"
                :disabled="match.state === 'complete'"
                :min="0"
                :max="props.match.firstTo"
              />
              <div flex="~ col" align="items-center" p="2">
                <el-avatar v-if="'user' in match.player2" size="large" :src="match.player2.user.avatarUrl" />
                <span v-if="'user' in match.player2" text="base">{{ match.player2.user.username }}</span>
                <span v-else text="base">{{ match.player2.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <div grid="~ cols-4 gap-3" m="t-4">
          <div>
            <span display="block" text="xs">first to</span>
            <el-select v-model="firstToTemplate" :disabled="match.state === 'complete'" filterable allow-create>
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
            :disabled="match.state !== 'pending'"
            @update:model-value="(val) => (startDateTemplate = dayjs(val).utc().format())"
          />
          <div grid="col-span-4" justify="self-center" class="sm:w-min-80">
            <span display="block" text="sm">rules lobby (if exist)</span>
            <el-input
              v-model="rulesLobbyTemplate"
              :disabled="match.state !== 'pending'"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6 }"
              w="min-[80%]"
            />
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane
        v-if="access?.isAdmin || access?.isReferee || access?.isOwner || isCaptainOrOwnPlayer"
        label="Reschedule"
        name="matchReschedule"
        :disabled="match.state === 'complete' || match.state === 'playing'"
      >
        <div v-if="!isCaptainOrOwnPlayer">
          {{
            tournament?.type === TournamentType.Solo
              ? 'Only players can edit reschedule'
              : 'Only captains can edit reschedule'
          }}
        </div>
        <el-timeline p="2">
          <el-timeline-item
            v-for="(reschedule, index) in match.reschedules"
            :key="index"
            :timestamp="
              'schedule: ' +
              (reschedule.schedule
                ? getDateString(reschedule.schedule)
                : reschedule.status === 'accepted'
                ? 'Accept'
                : 'Refuse')
            "
            placement="top"
            :type="
              reschedule.status === 'request' ? 'warning' : reschedule.status === 'accepted' ? 'success' : 'danger'
            "
            size="large"
          >
            <el-card shadow="never">
              <div flex="~ wrap">
                <div flex="~ 1">
                  <el-avatar
                    :src="
                      reschedule.playerId === match.player1Id
                        ? getPlayerProprety(match.player1, 'avatarUrl')
                        : reschedule.playerId === match.player2Id
                        ? getPlayerProprety(match.player2, 'avatarUrl')
                        : reschedule.superReferee?.admin?.user.avatarUrl ||
                          reschedule.superReferee?.referee?.user.avatarUrl ||
                          tournament?.owner.avatarUrl
                    "
                  />
                  <div flex="~" align="items-center">
                    <div flex="~ col" justify="between" m="l-2">
                      <div font="semibold">
                        {{
                          reschedule.playerId === match.player1Id
                            ? getPlayerProprety(match.player1, 'username')
                            : reschedule.playerId === match.player2Id
                            ? getPlayerProprety(match.player2, 'username')
                            : reschedule.superReferee?.admin?.user.username ||
                              reschedule.superReferee?.referee?.user.username ||
                              tournament?.owner.username
                        }}
                        <span v-if="reschedule.superRefereeId" font="normal italic" text="sm" m="l-1">referee</span>
                      </div>
                      <div :class="{ italic: reschedule.status === 'accepted' || reschedule.status === 'refused' }">
                        {{ reschedule.shortMessage }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-timeline-item>
          <el-timeline-item
            v-if="match.reschedules.at(-1)?.status !== 'accepted' && !match.reschedules.at(-1)?.superRefereeId"
            placement="top"
            :type="
              statusNewReschedule === 'accepted' ? 'success' : statusNewReschedule === 'refused' ? 'danger' : 'info'
            "
            :timestamp="
              !match.reschedules.length && !rescheduleDate
                ? 'date request'
                : match.reschedules.length && !rescheduleDate && showCreateReschedule
                ? 'Respond with a new date'
                : rescheduleDate
                ? getDateString(rescheduleDate)
                : statusNewReschedule === 'accepted'
                ? 'Accept'
                : statusNewReschedule === 'refused'
                ? 'Refuse'
                : getInfoMessageReschedule()
            "
          >
            <el-button-group v-if="match.reschedules.length > 0">
              <el-tooltip v-if="canReschedule" content="reply with reschedule" placement="bottom">
                <el-button type="primary" @click="replyReschedule('request', true)"
                  ><i-fluent-mdl2:calendar-reply
                /></el-button>
              </el-tooltip>
              <el-button
                v-if="canReschedule && isCaptainOrOwnPlayer"
                type="primary"
                @click="replyReschedule('accepted', false)"
                >accept reschedule
              </el-button>
              <el-button
                v-if="canReschedule && isCaptainOrOwnPlayer"
                type="primary"
                @click="replyReschedule('refused', false)"
                >don't accept thisreschedule
              </el-button>
            </el-button-group>
            <el-card v-if="showCreateReschedule || !match.reschedules.length" shadow="never">
              <CommonDatepicker
                :model-value="rescheduleDate"
                type="datetime"
                title="reschedule"
                :disabled="!isCaptainOrOwnPlayer"
                @update:model-value="(val) => (rescheduleDate = dayjs(val).utc().format())"
              />
              <div>
                <span display="block" text="xs">short message (if necessary)</span>
                <el-input
                  v-model="shortMessage"
                  type="textarea"
                  resize="none"
                  :disabled="!isCaptainOrOwnPlayer"
                  :autosize="{ minRows: 2, maxRows: 3 }"
                  w="max-250px"
                />
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-tab-pane>

      <el-tab-pane
        v-if="(access?.isAdmin || access?.isReferee || access?.isOwner || isCaptainOrOwnPlayer) && match.rulesLobby"
        label="rules in lobby"
        name="matchRules"
      >
        <el-card>{{ match.rulesLobby }}</el-card>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <template v-if="activeTab === 'matchDetail'">
        <div flex="~" align="items-center" justify="between">
          <el-button v-if="!match.superReferee" type="primary" @click="joinMatchAsReferee(match.id)"
            >Join as referee
          </el-button>
          <div v-if="match.superReferee" flex="~" align="items-center">
            <div text="lg" m="r-3">Referee:</div>
            <el-avatar
              :src="
                match.superReferee.admin?.user.avatarUrl ||
                match.superReferee.referee?.user.avatarUrl ||
                tournament?.owner.avatarUrl
              "
            />
            <span m="l-1" text="overflow-ellipsis space-nowrap" overflow="hidden">
              {{
                match.superReferee.admin?.user.username ||
                match.superReferee.referee?.user.username ||
                tournament?.owner.username
              }}
            </span>
            <el-button
              v-if="
                match.superReferee.admin?.user.id === user?.id ||
                match.superReferee.referee?.user.id === user?.id ||
                tournament?.owner.id === user?.id
              "
              m="l-4"
              type="warning"
              @click="undoMatchReferee(match.id)"
              >Undo Referee
            </el-button>
          </div>
          <div>
            {{ match.startDate ? 'schedule: ' + dayjs(match.startDate).format('LLLL') : 'unscheduled yet' }}
          </div>
        </div>
      </template>
      <template v-if="activeTab === 'matchUpdate'">
        <el-button
          type="success"
          :disabled="
            firstToTemplate === match.firstTo &&
            player1ScoreTemplate === match.player1Score &&
            player2ScoreTemplate === match.player2Score &&
            matchesHistoryOsuTemplate === match.matchesHistoryOsu &&
            stateTemplate === match.state &&
            startDateTemplate === match.startDate &&
            rulesLobbyTemplate === match.rulesLobby
          "
          :loading="updateLoading"
          @click="updateMatchTemplate"
          >Update
        </el-button>
      </template>
      <template v-if="activeTab === 'matchReschedule' && isCaptainOrOwnPlayer">
        <el-button
          v-if="match.reschedules.at(-1)?.status !== 'accepted' && !match.reschedules.at(-1)?.superRefereeId"
          type="success"
          :disabled="statusNewReschedule === 'request' && !rescheduleDate"
          :loading="updateLoading"
          @click="rescheduleMatchTemplate"
          >Confirm
        </el-button>
        <div v-else>If schedule goes wrong please contact a referee</div>
      </template>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.el-timeline-item__wrapper div) {
  color: inherit;
}
</style>
