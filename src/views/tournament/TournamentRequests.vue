<script lang="ts" setup>
import { Role } from '~/types';

const { fetchTournament, fetchControlAccess, acceptCandidate } = tournamentStore();
const { tournament, isAuthorized, access, staffRequests } = storeToRefs(tournamentStore());

const router = useRouter();

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
let acceptLoading = $ref(false);

async function init() {
  fetchControlAccess(tournamentId);
  fetchTournament(tournamentId);
}

onBeforeMount(async () => {
  init();
});

const goBack = () => {
  router.push({
    name: 'home',
  });
};

async function accept(staffId: number, role: Role) {
  try {
    acceptLoading = true;
    const data = await acceptCandidate(tournamentId, staffId, role);
    console.log(data);
    ElNotification({ title: data.subject, message: data.message, type: 'success', zIndex: 10, duration: 0 });
  } catch (e: unknown) {
    ElNotification({ message: e as string, type: 'error', zIndex: 10, duration: 0 });
  } finally {
    acceptLoading = false;
  }
}
</script>

<template>
  <el-empty v-if="!isAuthorized || (!access?.isAdmin && !access?.isOwner)">
    <template #description>Only admins have access to this page</template>
  </el-empty>
  <div v-else-if="tournament" grid="~ cols-5 gap-4">
    <div grid="col-span-4">
      <TournamentStaffTable :data="staffRequests">
        <template #extraBtn="scope">
          <el-tooltip content="accept" placement="left">
            <el-button
              :loading="acceptLoading"
              type="success"
              size="small"
              round
              m="l"
              @click="accept(scope.id, scope.source)"
            >
              <i-ic:round-check />
            </el-button>
          </el-tooltip>
        </template>
      </TournamentStaffTable>
    </div>
    <TournamentStaff :tournament-id="tournament.id" />
  </div>
  <el-empty v-else>
    <template #description>
      <div display="block" m="b-2">I dont have this tournament sorry</div>
      <el-button type="primary" @click="goBack">Back</el-button>
    </template>
  </el-empty>
</template>
