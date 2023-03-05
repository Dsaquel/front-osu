<script setup lang="ts">
import router from '~/router';
import { TemplateNotification } from '~/types';

const { fetchTournament, fetchControlAccess, fetchParticipants, removeParticipant } = tournamentStore();
const { tournament, isAuthorized, access, participantsAccepted } = storeToRefs(tournamentStore());

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
let removeLoading = $ref(false);
let initLoading = $ref(false);
const tableParticipant = ref();

async function init() {
  try {
    await fetchControlAccess(tournamentId);
    await fetchTournament(tournamentId);
    await fetchParticipants(tournamentId);
  } catch (e) {
    console.log('init error', e);
  }
}

onBeforeMount(async () => {
  initLoading = true;
  await init();
  initLoading = false;
});

async function remove(participantId: number) {
  try {
    removeLoading = true;
    const data = await removeParticipant(participantId, tournamentId);
    ElNotification({
      title: (<TemplateNotification>data).subject,
      message: (<TemplateNotification>data).message,
      type: 'success',
      zIndex: 10,
      duration: 0,
    });
  } catch (e) {
    console.log(e);
  } finally {
    removeLoading = false;
  }
}

const goBack = () => {
  router.push({
    name: 'home',
  });
};
</script>

<template>
  <div v-if="!initLoading" class="sm:max-w-900px mx-auto">
    <el-empty v-if="!isAuthorized || (!access?.isAdmin && !access?.isOwner)">
      <template #description>Only admins have access to this page</template>
    </el-empty>
    <div v-else-if="tournament">
      <div>
        <el-table
          ref="tableParticipant"
          :data="participantsAccepted"
          row-key="id"
          stripe
          height="max-content"
          w="full"
          :highlight-current-row="true"
        >
          <el-table-column label="Participant">
            <template #default="scope">
              <div display="flex" align="items-center">
                <el-avatar :src="scope.row.user.avatarUrl"></el-avatar>
                <span m="l-2">{{ scope.row.user.username }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="Rank">
            <template #default="scope">
              {{ scope.row.user.rank }}
            </template>
          </el-table-column>

          <el-table-column label="Discord">
            <template #default="scope">
              {{ scope.row.user.discord }}
            </template>
          </el-table-column>

          <el-table-column label="Actions" align="right">
            <template #default="scope">
              <el-tooltip content="remove" placement="right">
                <el-button
                  :loading="removeLoading"
                  type="danger"
                  size="small"
                  round
                  m="l-1"
                  @click="remove(scope.row.id)"
                  ><i-akar-icons:cross />
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
