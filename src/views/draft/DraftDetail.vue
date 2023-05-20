<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { ElNotification } from 'element-plus';
import { Role } from '~/types';

const router = useRouter();
const { fetchDraft, updateDraftPrivacy } = draftStore();
const { fetchControlAccess, addStaff, fetchParticipationOfUser } = tournamentStore();
const { isAuthorized, participationUser, access } = storeToRefs(tournamentStore());
const { draft } = storeToRefs(draftStore());
const { user } = storeToRefs(userStore());

const draftId = $ref(parseInt(useRoute().params?.draftId as string, 10));

const showDialog = ref(false);
let loading = $ref(false);
let initLoading = $ref(false);
const isDraftPrivacyLoading = ref(false);

const role = ref<Role>();
const options: Role[] = ['referee', 'mappooler', 'admin'];

async function init() {
  try {
    await fetchDraft(draftId);
    if (user.value) {
      await fetchControlAccess(draft.value?.tournament.id as number);
      await fetchParticipationOfUser(draft.value?.tournament.id as number);
    }
  } catch (e) {
    console.log('init error', e);
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

async function createStaff(tournamentId: number, role?: Role) {
  try {
    if (!role) return;
    loading = true;
    const data = await addStaff(tournamentId, role);
    ElNotification({ title: data.subject, message: data.message, type: 'success', zIndex: 10, duration: 0 });
  } catch (e: unknown) {
    ElNotification({ message: e as string, type: 'error', zIndex: 10, duration: 0 });
  } finally {
    loading = false;
    showDialog.value = false;
  }
}

function selectDisabled(item: Role): boolean {
  if (participationUser.value === undefined) return true;
  if (item === 'admin') return participationUser.value.participationAsAdmin;
  if (item === 'mappooler') return participationUser.value.participationAsMappooler;
  if (item === 'referee') return participationUser.value.participationAsReferee;
  return true;
}

const goRequests = () => {
  router.push({
    name: 'tournament-requests',
    params: { tournamentId: draft.value?.tournament.id },
  });
};

async function updateDraftPrivacyTemplate() {
  if (!draft.value) return;
  isDraftPrivacyLoading.value = true;
  try {
    await updateDraftPrivacy(draft.value.id, draft.value.isPublic);
  } catch (e) {
    console.log(e);
  } finally {
    isDraftPrivacyLoading.value = false;
  }
}
</script>

<template>
  <div v-if="!initLoading" v-loading.fullscreen.lock="initLoading">
    <div v-if="draft" grid="~ cols-7 gap-4">
      <el-empty v-if="!draft.isPublic && !isAuthorized">
        <template #description>You dont have access to this draft</template>
      </el-empty>
      <div v-else grid="col-span-5">
        <div display="grid" grid="gap-4" v-bind="useAttrs()">
          <el-alert v-if="!draft.isPublic" title="draft not public" type="info" show-icon pos="absolute inset-0" />
          <el-descriptions border direction="horizontal" :column="1" m="t-4">
            <template #title>
              <span text="xl">{{ draft.name }}</span>
            </template>
            <template #extra>
              <el-switch
                v-if="draft.isPublicable && (access!.isAdmin || access!.isOwner)"
                v-model="draft.isPublic"
                class="ml-2"
                size="large"
                inline-prompt
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                active-text="Draft visible"
                inactive-text="Draft private"
                :loading="isDraftPrivacyLoading"
                @change="updateDraftPrivacyTemplate"
              />
              <router-link
                v-if="isAuthorized"
                :to="{ name: 'tournament-detail', params: { tournamentId: draft.tournament.id } }"
                m="l-2"
              >
                <el-button type="primary" plain round> tournament </el-button>
              </router-link>
              <router-link
                v-if="access!.isAdmin || access!.isOwner"
                :to="{ name: 'draft-update', params: { draftId: draft.id } }"
                m="l-2"
              >
                <el-button type="primary" plain round><i-material-symbols:edit /> </el-button>
              </router-link>
            </template>
            <el-descriptions-item label="type">{{ `osu ${draft.mode}` }}</el-descriptions-item>
            <el-descriptions-item label="accept rank">
              {{
                (draft.rangePlayerMin === 1 || !draft.rangePlayerMin) && !draft.rangePlayerMax
                  ? 'Open rank'
                  : `${draft.rangePlayerMin} to ${draft.rangePlayerMax || '+&#8734;'}`
              }}
            </el-descriptions-item>
            <el-descriptions-item label="estimation start date">{{ draft.estimateStartDate }}</el-descriptions-item>
            <el-descriptions-item label="number player">{{ draft.numbersPlayers }}</el-descriptions-item>
            <el-descriptions-item label="type">{{ draft.type }}</el-descriptions-item>
          </el-descriptions>

          <div>
            <span display="inline-block">Details</span>
            <MarkdownRender :text="draft.details" />
          </div>
          <el-popover
            v-if="isAuthorized"
            placement="top-start"
            trigger="hover"
            width="auto"
            :content="access!.isAdmin || access!.isOwner ? 'You have already all permissions' : 'Ask your admin to upgrade your status'"
          >
            <template #reference>
              <div m="t-4" place="self-end">
                <el-button v-if="user" :disabled="isAuthorized" type="success"> participate </el-button>
              </div>
            </template>
          </el-popover>
          <el-button v-else-if="user" type="success" place="self-end" @click="showDialog = true">
            participate
          </el-button>
          <el-dialog v-model="showDialog" title="Entry form" w="5/10 min-[600px]" class="<sm:min-w-full">
            <div display="grid" grid="cols-1 gap-2" justify="items-center">
              <transition>
                <span v-if="!!role" display="block">I want to be</span>
              </transition>

              <el-select v-model="role" size="large" placeholder="I want to be">
                <!-- <el-option disabled value="ekoro" /> -->
                <el-option v-for="(item, i) in options" :key="i" :value="item" :disabled="selectDisabled(item)" />
              </el-select>

              <el-descriptions v-if="role" :column="1" title="verify your data before participating" border>
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
                >
                  Confirm
                </el-button>
              </span>
            </template>
          </el-dialog>
        </div>
      </div>
      <TournamentStaff grid="col-span-2" :tournament-id="draft.tournament.id">
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
