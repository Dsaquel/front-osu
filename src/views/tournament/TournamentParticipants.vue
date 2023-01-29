<script setup lang="ts">
const { fetchTournament, fetchControlAccess, fetchParticipants } = tournamentStore();
const { tournament, isAuthorized, access, participants } = storeToRefs(tournamentStore());

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
let removeLoading = $ref(false);
let initLoading = $ref(false);
const tableParticipant = ref();

async function init() {
  await fetchControlAccess(tournamentId);
  await fetchTournament(tournamentId);
  await fetchParticipants(tournamentId);
}

onBeforeMount(async () => {
  initLoading = true;
  await init();
  initLoading = false;
});

async function remove() {
  removeLoading = true;
  //
  removeLoading = false;
}
</script>

<template>
  <div v-if="!initLoading">
    <el-empty v-if="!isAuthorized || (!access?.isAdmin && !access?.isOwner)">
      <template #description>Only admins have access to this page</template>
    </el-empty>
    <div v-else-if="tournament" grid="~ cols-7 gap-4">
      <div grid="col-span-5" class="<lg:col-span-7">
        <el-table
          ref="tableParticipant"
          :data="participants"
          row-key="id"
          stripe
          height="max-content"
          w="full"
          :highlight-current-row="true"
        >
          <el-table-column label="Candidate">
            <template #default="scope">
              <div display="flex" align="items-center">
                <el-avatar :src="scope.row.user.avatarUrl"></el-avatar>
                <span m="l-2">{{ scope.row.user.username }}</span>
              </div>
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
                  @click="remove(scope.row.id, scope.row.source)"
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
