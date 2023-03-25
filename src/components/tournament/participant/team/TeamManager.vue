<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue';
import { ParticipantInvitation, ParticipantRequest, ParticipantTeam, TemplateNotification, User } from '~/types';

const {
  fetchParticipantTeamRequests,
  changeRequestStatus,
  fetchParticipantTeamInvitations,
  sendInvitationsTeamToUser,
} = tournamentStore();
const { participantsRequests, participantsInvitations, tournament } = storeToRefs(tournamentStore());
const { fetchUsersByUsername } = userStore();

const props = defineProps<{
  team: ParticipantTeam;
  tournamentId: number;
}>();

const showDialog = ref(false);
const activeTab = ref('requests');
const initLoading = ref(false);
const searchUserRequest = ref();
const loadingStatus = ref(undefined as ParticipantRequest['status'] | undefined);
const loadingRequestId = ref(undefined as number | undefined);

const selectedUsersId = ref([] as number[]);
const suggestionsUser = ref(undefined as User[] | undefined);
const searchUserLoading = ref(false);
const sendingInvitation = ref(false);

async function init() {
  try {
    await fetchParticipantTeamRequests(props.tournamentId, props.team.id);
    await fetchParticipantTeamInvitations(props.tournamentId, props.team.id);
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
  participantsRequests.value?.filter(
    (data) =>
      !searchUserRequest.value ||
      data.userRequest.username.toLowerCase().includes(searchUserRequest.value.toLowerCase()),
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

async function searchUserRemote(query: string) {
  try {
    if (query) {
      searchUserLoading.value = true;
      suggestionsUser.value = await fetchUsersByUsername(query);
    }
  } catch (e) {
    console.log(e);
  } finally {
    searchUserLoading.value = false;
  }
}

async function sendInvitationsTeamToUserTemplate() {
  try {
    sendingInvitation.value = true;
    const notification = await sendInvitationsTeamToUser(props.tournamentId, props.team.id, selectedUsersId.value);
    ElMessage({
      message: (<TemplateNotification>notification).message,
      type: 'success',
      zIndex: 10,
      duration: 2000,
    });
  } catch (e) {
    console.log(e);
  } finally {
    sendingInvitation.value = false;
  }
}
</script>

<template>
  <el-popover
    v-if="team.users.length === tournament?.teamNumberMax"
    placement="left"
    trigger="hover"
    width="auto"
    :content="'team full'"
  >
    <template #reference>
      <div display="inline-block">
        <el-button pointer="auto" type="primary" disabled round>manage</el-button>
      </div>
    </template>
  </el-popover>
  <el-button v-else type="primary" round @click="showDialog = true">manage</el-button>
  <el-dialog
    v-if="participantsRequests"
    v-model="showDialog"
    title="Manage your team"
    w="5/10 min-[600px]"
    align-center
    @closed="resetData"
  >
    <el-tabs v-model="activeTab">
      <el-tab-pane label="Requests" name="requests">
        <el-table :data="filterRequestsByUsername" empty-text="no request for now">
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
              <el-input v-model="searchUserRequest" size="small" placeholder="Type to search" />
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
      <el-tab-pane label="Invitations" name="invitations">
        <div display="block">
          <el-select
            v-model="selectedUsersId"
            multiple
            filterable
            remote
            reserve-keyword
            collapse-tags
            collapse-tags-tooltip
            :multiple-limit="5"
            placeholder="Varvalian"
            :remote-method="searchUserRemote"
            :loading="searchUserLoading"
          >
            <el-option
              v-for="item in suggestionsUser"
              :key="item.id"
              :label="item.username"
              :value="item.id"
              :disabled="participantsInvitations?.map((t) => t.id).includes(item.id)"
              h="!50px"
              flex="~"
            >
              <div display="flex" align="items-center">
                <el-avatar :src="item.avatarUrl" />
                <span m="l-2" text="overflow-ellipsis space-nowrap" overflow="hidden">
                  {{ item.username }}
                </span>
              </div>
            </el-option>
          </el-select>
          <el-button
            v-if="selectedUsersId.length"
            type="success"
            plain
            m="l-2"
            @click="sendInvitationsTeamToUserTemplate"
            >Send</el-button
          >
        </div>
        <el-table :data="participantsInvitations" empty-text="no invitation sent">
          <el-table-column label="user invited">
            <template #default="scope: { row: ParticipantInvitation }">
              <div display="flex" align="items-center">
                <el-avatar :src="scope.row.userInvited.avatarUrl" />
                <span m="l-2" text="overflow-ellipsis space-nowrap" overflow="hidden">
                  {{ scope.row.userInvited.username }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="status">
            <template #default="scope: { row: ParticipantInvitation }">
              <el-tag :type="scope.row.status === 'pending' ? 'warning' : 'danger'">{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
