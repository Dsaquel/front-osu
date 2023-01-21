<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
const router = useRouter();
const draftId = $ref(parseInt(useRoute().params?.draftId as string, 10));
const { fetchDraft } = draftStore();
const { controlAccess } = tournamentStore();
const { isAuthorized } = storeToRefs(tournamentStore());
const { draft } = storeToRefs(draftStore());

let draftLoading = $ref(false);

async function init() {
  if (!draftId) return;
  await fetchDraft(draftId);
  await controlAccess(draft.value?.tournament.id as number);
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

function participate() {
  // staff participant
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
        <el-button v-if="isAuthorized" type="success" m="t-4" place="self-end" @click="participate">
          participate
        </el-button>
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
