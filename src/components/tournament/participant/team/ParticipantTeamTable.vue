<script setup lang="ts">
import { ParticipantTeam, TemplateNotification } from '~/types';

const props = defineProps<{
  participantsTeams: ParticipantTeam[];
}>();

const route = useRoute();

const { updateParticipantValidation } = tournamentStore();
const { isOwnerOrAdmin, tournament } = storeToRefs(tournamentStore());
const { user } = storeToRefs(userStore());
const tournamentId = $ref(parseInt(route.params?.tournamentId as string, 10));

const updateLoading = ref(false);
const tableParticipant = ref();

function getCurrentRow() {
  if (route.query.teamId && props.participantsTeams) {
    const row = props.participantsTeams.find(
      (participantTeam) => participantTeam.id === +(route.query.teamId as string),
    );
    tableParticipant.value.setCurrentRow(row);
  }
}

onMounted(() => {
  getCurrentRow();
});

async function udpateParticipantValidationTemplate(participantId: number, validate: boolean) {
  try {
    updateLoading.value = true;
    const data = await updateParticipantValidation(participantId, tournamentId, validate);
    ElNotification({
      title: (<TemplateNotification>data).subject,
      message: (<TemplateNotification>data).message,
      type: 'success',
      zIndex: 10,
      duration: 2000,
    });
  } catch (e) {
    console.log(e);
  } finally {
    updateLoading.value = false;
  }
}
</script>

<template>
  <el-table
    v-if="tournament && user"
    ref="tableParticipant"
    :data="participantsTeams"
    row-key="id"
    stripe
    height="max-content"
    w="full"
    :highlight-current-row="true"
  >
    <el-table-column label="Captain">
      <template #default="scope: { row: ParticipantTeam }">
        <div display="flex" align="items-center">
          <el-avatar :src="scope.row.captain.avatarUrl"></el-avatar>
          <span m="l-2">{{ scope.row.captain.username }}</span>
        </div>
      </template>
    </el-table-column>

    <el-table-column :label="`minimum ${tournament.teamNumberMin}`">
      <template #default="scope: { row: ParticipantTeam }">
        {{ scope.row.users.length }}
      </template>
    </el-table-column>

    <el-table-column label="players">
      <template #default="scope: { row: ParticipantTeam }">
        <template v-for="item in scope.row.users" :key="item.osuId">
          <el-popover
            trigger="hover"
            width="auto"
            placement="bottom"
            :hide-after="50"
            :title="item.username"
            :content="`rank: ${item.rank}\ndiscord: ${item.discord || 'no discord'}`"
          >
            <template #reference>
              <el-avatar class="float-left ml-[-10px]" :src="item.avatarUrl" />
            </template>
          </el-popover>
        </template>
      </template>
    </el-table-column>

    <el-table-column label="validate">
      <template #default="scope: { row: ParticipantTeam }">
        {{ scope.row.validate ? 'yes' : 'no' }}
      </template>
    </el-table-column>

    <el-table-column label="Actions">
      <template #default="scope: { row: ParticipantTeam }">
        <el-switch
          v-if="isOwnerOrAdmin"
          v-model="scope.row.validate"
          inline-prompt
          size="large"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          active-text="validate"
          inactive-text="invalidate"
          :loading="updateLoading"
          @change="udpateParticipantValidationTemplate(scope.row.id, scope.row.validate)"
        />
        <TeamManager v-if="user.id === scope.row.captainId" :team="scope.row" :tournament-id="tournament.id" />
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss">
:deep(.el-table__inner-wrapper::before) {
  z-index: 1;
}
</style>
