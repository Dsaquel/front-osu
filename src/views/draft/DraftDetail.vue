<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { ParticipationUser, Role } from '~/types';

const router = useRouter();
const draftId = $ref(parseInt(useRoute().params?.draftId as string, 10));
const { fetchDraft } = draftStore();
const { fetchControlAccess, addStaff, fetchParticipationOfUser } = tournamentStore();
const { isAuthorized, participationUser } = storeToRefs(tournamentStore());
const { draft } = storeToRefs(draftStore());
const { user } = storeToRefs(userStore());

let draftLoading = $ref(false);
const showDialog = ref(false);
let loading = $ref(false);
const role = ref<Role>();
const options = ['referee', 'mappooler', 'admin'];

async function init() {
  if (!draftId) return;
  await fetchDraft(draftId);
  await fetchControlAccess(draft.value?.tournament.id as number);
  await fetchParticipationOfUser(draft.value?.tournament.id as number);
}

onMounted(async () => {
  draftLoading = true;
  await init();
  draftLoading = false;
});

const goBack = () => {
  router.push({
    name: 'home',
  });
};

async function createStaff(tournamentId: number, role?: Role) {
  try {
    if (!role) return;
    loading = true;
    const data = await addStaff(tournamentId, role);
    ElNotification({ title: data.subject, message: data.message, type: 'success', zIndex: 10, duration: 0 });
  } catch (e: any) {
    ElNotification({ message: e, type: 'error', zIndex: 10, duration: 0 });
  } finally {
    loading = false;
  }
}

function selectDisabled(item: Role): boolean {
  if (participationUser.value === undefined) return true;
  if (item === 'admin') return participationUser.value.participationAsAdmin;
  if (item === 'mappooler') return participationUser.value.participationAsMappooler;
  if (item === 'referee') return participationUser.value.participationAsReferee;
  return true;
}
</script>

<template>
  <div v-if="draft">
    <el-empty v-if="!draft.isPublic && !isAuthorized" v-loading="draftLoading">
      <template v-if="!draftLoading" #description>You dont have access to this draft</template>
    </el-empty>
    <div v-else>
      <div class="container" display="grid" grid="row-start-2" v-bind="useAttrs()">
        <el-alert
          v-if="!draft.isPublic"
          title="tournament not yet public"
          type="info"
          show-icon
          pos="absolute inset-0"
        />
        <el-descriptions border direction="horizontal" :column="1" m="t-4">
          <template #title>
            <span text="xl">{{ draft.name }}</span></template
          >
          <template #extra>
            <router-link
              v-if="isAuthorized"
              :to="{ name: 'tournament-detail', params: { tournamentId: draft.tournament.id } }"
              m="l-2"
            >
              <el-button type="primary" plain round> tournament </el-button>
            </router-link>
            <router-link v-if="isAuthorized" :to="{ name: 'draft-update', params: { draftId: draft.id } }" m="l-2">
              <el-button type="primary" plain round><i-material-symbols:edit /> </el-button>
            </router-link>
          </template>
          <el-descriptions-item label="type">{{ `osu ${draft.type}` }}</el-descriptions-item>
          <el-descriptions-item label="accept rank">
            {{
              (draft.rangePlayerMin === 1 || !draft.rangePlayerMin) && !draft.rangePlayerMax
                ? 'Open rank'
                : `${draft.rangePlayerMin} to ${draft.rangePlayerMax || '+&#8734;'}`
            }}
          </el-descriptions-item>
          <el-descriptions-item label="estimation start date">{{ draft.estimateStartDate }}</el-descriptions-item>
          <el-descriptions-item label="number player">{{ draft.numbersPlayers }}</el-descriptions-item>
        </el-descriptions>

        <div>
          <span display="inline-block">Details</span>
          <MarkdownRender :text="draft.details" />
        </div>
        <el-button v-if="isAuthorized && user" type="success" m="t-4" place="self-end" @click="showDialog = true">
          participate
        </el-button>
        <el-dialog v-model="showDialog" title="Entry form" w="5/10 min-[600px]" class="<sm:min-w-full">
          <div display="grid" grid="cols-1 gap-2" justify="items-center">
            <transition>
              <span v-if="!!role" display="block">I want to be</span>
            </transition>
            <el-select v-model="role" size="large" placeholder="I want to be">
              <el-option v-for="(item, i) in options" :key="i" :value="item" :disabled="selectDisabled(item)" />
            </el-select>

            <el-descriptions :column="1" title="verify your data before participating" border>
              <el-descriptions-item label="username">{{ user!.username }}</el-descriptions-item>
              <el-descriptions-item label="discord">{{ user!.discord }}</el-descriptions-item>
              <el-descriptions-item label="osu id">{{ user!.osuId }}</el-descriptions-item>
            </el-descriptions>
          </div>
          <template #footer>
            <span>
              <el-button @click="showDialog = false">Cancel</el-button>
              <el-button
                :loading="loading"
                type="primary"
                :disabled="!role"
                @click="createStaff(draft!.tournament.id, role)"
                >Confirm
              </el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
  <el-empty v-else>
    <template #description>
      <div display="block" m="b-2">I dont have this tournament sorry</div>
      <el-button type="primary" @click="goBack">Back</el-button>
    </template>
  </el-empty>
</template>

<style scoped lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
