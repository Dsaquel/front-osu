<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { TemplateNotification } from '~/types';

const router = useRouter();
const { fetchTournament, fetchControlAccess, addParticipant, passToBracketPhase } = tournamentStore();
const { tournament, isAuthorized, access } = storeToRefs(tournamentStore());
const { user } = storeToRefs(userStore());

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));

let initLoading = $ref(false);
let showDialog = $ref(false);
let participantLoading = $ref(false);
const bracketPhaseLoading = ref(false);

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

async function participate() {
  participantLoading = true;
  showDialog = false;
  try {
    const notification = await addParticipant(tournamentId);

    ElNotification({
      title: (<TemplateNotification>notification).subject,
      message: (<TemplateNotification>notification).message,
      type: 'success',
      zIndex: 10,
      duration: 0,
    });
  } catch (e) {
    console.log(e);
  } finally {
    participantLoading = false;
  }
}

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
              <router-link
                v-if="tournament.draft.isPublic"
                :to="{ name: 'draft-detail', params: { draftId: tournament.draftId } }"
              >
                <el-button link>recruitement</el-button>
              </router-link>
              <router-link m="l-2" :to="{ name: 'qualifier-detail', params: { tournamentId: tournament.id } }">
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
                v-if="tournament.numbersPlayers && !tournament.hasQualifier && !tournament.isInBracketPhase"
                display="inline-block"
                m="l-2"
              >
                <el-popover
                  v-if="tournament.participants.length < tournament.numbersPlayers"
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
            <el-descriptions-item label="type">{{ `osu ${tournament.type}` }}</el-descriptions-item>
            <el-descriptions-item label="accept rank">
              {{
                (tournament.rangePlayerMin === 1 || !tournament.rangePlayerMin) && !tournament.rangePlayerMax
                  ? 'Open rank'
                  : `${tournament.rangePlayerMin} to ${tournament.rangePlayerMax || '+&#8734;'}`
              }}
            </el-descriptions-item>
            <el-descriptions-item label="end registration">{{ tournament.registrationEndDate }}</el-descriptions-item>
            <el-descriptions-item label="start date">{{ tournament.startDate }}</el-descriptions-item>
            <el-descriptions-item label="number player">{{ tournament.numbersPlayers }}</el-descriptions-item>
            <el-descriptions-item label="has qualifier">{{ tournament.qualifier ? 'yes' : 'no' }}</el-descriptions-item>
          </el-descriptions>

          <div>
            <span display="inline-block">Description</span>
            <MarkdownRender :text="tournament.description" />
          </div>
          <el-popover
            v-if="isAuthorized || tournament.registrationEnd"
            placement="top-start"
            trigger="hover"
            width="auto"
            :content="isAuthorized ? 'You are in the staffs' : 'registration ended'"
          >
            <template #reference>
              <div m="t-4" place="self-end">
                <el-button
                  :disabled="isAuthorized || tournament.registrationEnd"
                  :loading="participantLoading"
                  type="success"
                  @click="showDialog = true"
                >
                  participate
                </el-button>
              </div>
            </template>
          </el-popover>
          <el-button
            v-else-if="user"
            m="t-4"
            place="self-end"
            :disabled="isAuthorized || tournament.registrationEnd"
            :loading="participantLoading"
            type="success"
            @click="showDialog = true"
          >
            participate
          </el-button>
          <el-dialog v-model="showDialog" title="Confirmation" width="auto" align-center>
            <div text="lg center">Are you sure to participate ?</div>
            <div text="sm center space-nowrap">If you have any participation in the staff they will be removed</div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="showDialog = false">Cancel</el-button>
                <el-button type="primary" @click="participate"> Confirm </el-button>
              </span>
            </template>
          </el-dialog>
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
