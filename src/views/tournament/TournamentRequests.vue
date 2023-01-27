<script lang="ts" setup>
import { Role, Staff } from '~/types';

const { fetchTournament, fetchControlAccess, acceptCandidate, removeStaff } = tournamentStore();
const { tournament, isAuthorized, access, staffRequests } = storeToRefs(tournamentStore());

const router = useRouter();

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
let acceptLoading = $ref(false);
let removeLoading = $ref(false);

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

const tableStaff = ref();
function filterRequests(value: Role, row: Staff & { source: Role }) {
  return value === row.source;
}

function clearFilter() {
  tableStaff.value.clearFilter(['role']);
  tableStaff.value.clearSelection();
}

async function remove(staffId: number, role: Role) {
  try {
    removeLoading = true;
    const data = await removeStaff(tournamentId, staffId, role);
    ElNotification({ title: data.subject, message: data.message, type: 'success', zIndex: 10, duration: 0 });
  } catch (e: unknown) {
    ElNotification({ message: e as string, type: 'error', zIndex: 10, duration: 0 });
  } finally {
    removeLoading = false;
  }
}
</script>

<template>
  <el-empty v-if="!isAuthorized || (!access?.isAdmin && !access?.isOwner)">
    <template #description>Only admins have access to this page</template>
  </el-empty>
  <div v-else-if="tournament" grid="~ cols-5 gap-4">
    <div grid="col-span-4">
      <el-button @click="clearFilter">reset all filters</el-button>

      <el-table
        ref="tableStaff"
        :data="staffRequests"
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

        <el-table-column label="Profile">
          <template #default="scope">
            <a :href="`https://osu.ppy.sh/users/${scope.row.user.osuId}`" target="_blank">
              <el-button type="primary" size="small" link>osu profile</el-button>
            </a>
          </template>
        </el-table-column>

        <el-table-column
          label="Request for"
          :filter-method="filterRequests"
          :filters="[
            { text: 'admin', value: 'admin' },
            { text: 'mappooler', value: 'mappooler' },
            { text: 'referee', value: 'referee' },
          ]"
          column-key="role"
          :width="200"
        >
          <template #default="scope">
            <el-tag>{{ scope.row.source }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Actions" align="right">
          <template #default="scope">
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
    <TournamentStaff :tournament-id="tournament.id" />
  </div>
  <el-empty v-else>
    <template #description>
      <div display="block" m="b-2">I dont have this tournament sorry</div>
      <el-button type="primary" @click="goBack">Back</el-button>
    </template>
  </el-empty>
</template>
