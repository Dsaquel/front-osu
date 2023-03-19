<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import 'element-plus/es/components/message-box/style/css';
import dayjs from 'dayjs';
import { ElMessageBox } from 'element-plus';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(LocalizedFormat);

const router = useRouter();
const { fetchTournament, fetchControlAccess, passToBracketPhase, startTournament, updateTournamentPrivacy } =
  tournamentStore();
const { tournament, isAuthorized, access } = storeToRefs(tournamentStore());

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));

let initLoading = $ref(false);
const bracketPhaseLoading = ref(false);
const startTournamentLoading = ref(false);
const isTournamentPrivacyLoading = ref(false);

async function init() {
  try {
    if (!tournamentId) return;
    await fetchTournament(tournamentId);
    await fetchControlAccess(tournamentId);
  } catch (e) {
    console.log('init error');
  }
}

onBeforeMount(async () => {
  initLoading = true;
  await init();
  initLoading = false;
});

const goBack = () => {
  router.push({
    name: 'home',
  });
};

const goRequests = () => {
  router.push({
    name: 'tournament-requests',
    params: { tournamentId },
  });
};

async function bracketPhase(tournamentId: number) {
  try {
    bracketPhaseLoading.value = true;
    await passToBracketPhase(tournamentId);
  } catch (e) {
    console.log(e);
  }
  bracketPhaseLoading.value = false;
}

async function startTournamentTemplate(tournamentId: number) {
  if (!tournament.value || tournament.value?.participants.length < (tournament.value?.numbersPlayers as number)) return;
  ElMessageBox.confirm(
    `This action will start earlier the tournament that will set participants into ${
      tournament.value.hasQualifier ? 'qualifier' : 'tournament bracket'
    } and is it not reversible.`,
    'Wait a second',
    {
      confirmButtonText: 'Understand',
      cancelButtonText: 'Cancel',
      type: 'warning',
    },
  );
  startTournamentLoading.value = true;
  try {
    await startTournament(tournamentId);
  } catch (e) {
    console.log(e);
  } finally {
    startTournamentLoading.value = false;
  }
}

async function updateTournamentPrivacyTemplate() {
  if (!tournament.value) return;
  isTournamentPrivacyLoading.value = true;
  try {
    await updateTournamentPrivacy(tournament.value.id, tournament.value.isPublic);
  } catch (e) {
    console.log(e);
  } finally {
    isTournamentPrivacyLoading.value = false;
  }
}
</script>

<template>
  <div v-if="!initLoading">
    <div v-if="tournament" grid="~ cols-7 gap-4">
      <el-empty
        v-if="!tournament.isPublic && !isAuthorized"
        place="self-center"
        justify="self-center"
        grid="col-span-7"
      >
        <template #description>
          <div text="xl">You dont have access to this tournament</div>
        </template>
      </el-empty>

      <div v-else grid="col-span-5" class="<lg:col-span-7">
        <div class="container" display="grid" grid="row-start-2" v-bind="useAttrs()">
          <el-alert
            v-if="!tournament.isPublic"
            title="tournament not yet public"
            type="info"
            show-icon
            pos="absolute inset-0"
          />
          <el-descriptions border direction="horizontal" :column="1" m="t-4">
            <template #title>
              <span text="xl">{{ tournament.name }}</span></template
            >
            <template #extra>
              <el-switch
                v-if="tournament.isPublicable && (access!.isAdmin || access!.isOwner)"
                v-model="tournament.isPublic"
                class="ml-2"
                size="large"
                inline-prompt
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                active-text="Tournament visible"
                inactive-text="Tournament private"
                :loading="isTournamentPrivacyLoading"
                @change="updateTournamentPrivacyTemplate"
              />
              <router-link
                v-if="tournament.draft.isPublic || isAuthorized"
                :to="{ name: 'draft-detail', params: { draftId: tournament.draftId } }"
                m="l-2"
              >
                <el-button link>
                  {{
                    tournament.draft.isPublic && !isAuthorized
                      ? 'recruitement'
                      : !tournament.draft.isPublic && isAuthorized
                      ? 'draft'
                      : 'draft'
                  }}
                </el-button>
              </router-link>
              <router-link
                v-if="tournament.hasQualifier"
                m="l-2"
                :to="{ name: 'qualifier-detail', params: { tournamentId: tournament.id } }"
              >
                <el-button link>qualifier</el-button>
              </router-link>
              <router-link m="l-2" :to="{ name: 'tournament-participants', params: { tournamentId: tournament.id } }">
                <el-button link>participants</el-button>
              </router-link>
              <router-link m="l-2" :to="{ name: 'mappool-manager', params: { tournamentId: tournament.id } }">
                <el-button link>mappool</el-button>
              </router-link>
              <router-link m="l-2" :to="{ name: 'tournament-bracket', params: { tournamentId: tournament.id } }">
                <el-button link>bracket</el-button>
              </router-link>
              <router-link
                v-if="isAuthorized && (access?.isAdmin || access?.isOwner)"
                :to="{ name: 'tournament-update', params: { tournamentId: tournament.id } }"
                m="l-2"
              >
                <el-button type="primary" plain round><i-material-symbols:edit /> </el-button>
              </router-link>
              <div
                v-if="
                  tournament.numbersPlayers &&
                  !tournament.hasQualifier &&
                  !tournament.isInBracketPhase &&
                  tournament.isPublic
                "
                display="inline-block"
                m="l-2"
              >
                <el-popover
                  v-if="
                    (access?.isAdmin || access?.isOwner) && tournament.participants.length < tournament.numbersPlayers
                  "
                  trigger="hover"
                  placement="top"
                  :hide-after="50"
                  :content="`${tournament.participants.length}/${tournament.numbersPlayers} participants`"
                >
                  <template #reference>
                    <div>
                      <el-button type="primary" plain round disabled>pass in bracket phase </el-button>
                    </div>
                  </template>
                </el-popover>
                <el-button
                  v-else-if="tournament.participants.length === tournament.numbersPlayers"
                  type="primary"
                  plain
                  round
                  :loading="bracketPhaseLoading"
                  @click="bracketPhase(tournament!.id)"
                  >pass in bracket phase
                </el-button>
              </div>
            </template>
            <el-descriptions-item label="type">{{ `osu ${tournament.mode}` }}</el-descriptions-item>
            <el-descriptions-item label="accept rank">
              {{
                (tournament.rangePlayerMin === 1 || !tournament.rangePlayerMin) && !tournament.rangePlayerMax
                  ? 'Open rank'
                  : `${tournament.rangePlayerMin} to ${tournament.rangePlayerMax || '+&#8734;'}`
              }}
            </el-descriptions-item>
            <el-descriptions-item label="registration end">
              {{ tournament.registrationEndDate ? dayjs(tournament.registrationEndDate).format('LLLL') : '' }}
            </el-descriptions-item>
            <el-descriptions-item label="start date">
              <div flex="~" align="items-center" justify="between">
                {{ tournament.startDate ? dayjs(tournament.startDate).format('LLLL') : '' }}
                <el-button
                  v-if="
                    (access?.isAdmin || access?.isOwner) &&
                    !tournament.isPublic &&
                    tournament.numbersPlayers &&
                    tournament.participants.length >= tournament.numbersPlayers
                  "
                  type="success"
                  @click="startTournamentTemplate(tournamentId)"
                  >start before
                </el-button>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="number player">{{ tournament.numbersPlayers }}</el-descriptions-item>
            <el-descriptions-item label="type">{{ tournament.type }}</el-descriptions-item>
            <el-descriptions-item label="has qualifier">{{ tournament.qualifier ? 'yes' : 'no' }}</el-descriptions-item>
          </el-descriptions>

          <div>
            <span display="inline-block">Description</span>
            <MarkdownRender :text="tournament.description" />
          </div>
          <ParticipationConfirm />
        </div>
      </div>
      <TournamentStaff
        v-if="!(!tournament.isPublic && !isAuthorized)"
        grid="col-span-2"
        class="<lg:col-span-7"
        :tournament-id="tournament.id"
      >
        <template #goRequests>
          <el-button @click="goRequests">see requestes</el-button>
        </template>
      </TournamentStaff>
    </div>
    <el-empty v-else>
      <template #description>
        <div display="block" m="b-2">I dont have this tournament sorry</div>
        <el-button type="primary" @click="goBack">Back</el-button>
      </template>
    </el-empty>
  </div>
  <div v-else v-loading.fullscreen.lock="initLoading" />
</template>
