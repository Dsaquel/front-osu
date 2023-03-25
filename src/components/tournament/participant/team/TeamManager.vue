<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue';
import { ParticipantRequest, ParticipantTeam, TemplateNotification } from '~/types';

const { fetchParticipantsTeamRequest, changeRequestStatus } = tournamentStore();
const { participantsRequest } = storeToRefs(tournamentStore());

const props = defineProps<{
  team: ParticipantTeam;
  tournamentId: number;
}>();

const showDialog = ref(false);
const activeTab = ref('requests');
const initLoading = ref(false);
const search = ref('');
const loadingStatus = ref(undefined as ParticipantRequest['status'] | undefined);
const loadingRequestId = ref(undefined as number | undefined);

async function init() {
  try {
    await fetchParticipantsTeamRequest(props.tournamentId, props.team.id);
  } catch (e) {
    console.log('init error', e);
  }
}

onBeforeMount(async () => {
  initLoading.value = true;
  await init();
  initLoading.value = false;
});

function resetData() {
  loadingStatus.value = undefined;
  loadingRequestId.value = undefined;
  showDialog.value = false;
}

const filterRequestsByUsername = computed(() =>
  participantsRequest.value?.filter(
    (data) => !search.value || data.userRequest.username.toLowerCase().includes(search.value.toLowerCase()),
  ),
);

function filterRequests(value: ParticipantRequest['status'], row: ParticipantRequest) {
  return value === row.status;
}

async function changeRequestStatusTemplate(requestId: number, status: 'accepted' | 'declined') {
  loadingStatus.value = status;
  loadingRequestId.value = requestId;
  try {
    const notification = await changeRequestStatus(props.tournamentId, requestId, status, props.team.id);
    ElMessage({
      message: (<TemplateNotification>notification).message,
      type: 'success',
      zIndex: 10,
      duration: 2000,
    });
  } catch (e) {
    console.log(e);
  } finally {
    resetData();
  }
}
</script>

<template>
  <el-button type="primary" round @click="showDialog = true">manage</el-button>

  <el-dialog
    v-if="participantsRequest"
    v-model="showDialog"
    title="Manage your team"
    w="5/10 min-[600px]"
    align-center
    @closed="resetData"
  >
    <el-tabs v-model="activeTab">
      <el-tab-pane label="Requests" name="requests">
        <el-table :data="filterRequestsByUsername">
          <el-table-column label="user request">
            <template #default="scope: { row: ParticipantRequest }">
              <div display="flex" align="items-center">
                <el-avatar :src="scope.row.userRequest.avatarUrl" />
                <span m="l-2" text="overflow-ellipsis space-nowrap" overflow="hidden">
                  {{ scope.row.userRequest.username }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :filter-method="filterRequests"
            :filters="[
              { text: 'pending', value: 'pending' },
              { text: 'declined', value: 'declined' },
            ]"
            :filtered-value="['pending']"
            label="status"
            align="center"
          >
            <template #default="scope: { row: ParticipantRequest }">
              <el-tag :type="scope.row.status === 'pending' ? 'warning' : 'danger'">{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template #header>
              <el-input v-model="search" size="small" placeholder="Type to search" />
            </template>
            <template #default="scope: { row: ParticipantRequest }">
              <el-popconfirm
                width="250"
                title="There will be no turning back"
                confirm-button-text="Confirm"
                cancel-button-text="Cancel"
                :icon="InfoFilled"
                @confirm="changeRequestStatusTemplate(scope.row.id, 'accepted')"
              >
                <template #reference>
                  <el-button
                    type="success"
                    size="small"
                    :disabled="scope.row.id === loadingRequestId && loadingStatus === 'declined'"
                    :loading="scope.row.id === loadingRequestId && loadingStatus === 'accepted'"
                    >accept
                  </el-button>
                </template>
              </el-popconfirm>
              <el-button
                v-if="scope.row.status === 'pending'"
                type="danger"
                size="small"
                :disabled="scope.row.id === loadingRequestId && loadingStatus === 'declined'"
                :loading="scope.row.id === loadingRequestId && loadingStatus === 'declined'"
                @click="changeRequestStatusTemplate(scope.row.id, 'declined')"
                >declined
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Invitations" name="invitations">invitations</el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
