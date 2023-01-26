<script lang="ts" setup>
import { ElTable } from 'element-plus';
import { Staff } from '~/types';

const { fetchTournament, fetchControlAccess } = tournamentStore();
const { tournament, isAuthorized, access, staffRequests } = storeToRefs(tournamentStore());

const router = useRouter();

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));

const tableStaff = ref<InstanceType<typeof ElTable>>();

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

function filterRequests(value: string, row: Staff) {}
// filter / select for delete or adding
</script>

<template>
  <el-empty v-if="!isAuthorized || (!access?.isAdmin && !access?.isOwner)">
    <template #description>Only admins have access to this page</template>
  </el-empty>
  <div v-else-if="tournament" grid="~ cols-5 gap-4">
    <div grid="col-span-4">
      <el-table ref="tableStaff" :data="staffRequests" row-key="id" :lazy="true" height="max-content">
        <el-table-column type="selection" width="55" />

        <el-table-column label="name">
          <template #default="scope"> {{ scope.row.user.username }} </template>
        </el-table-column>

        <el-table-column label="profiles">
          <template #default="scope">
            <a :href="`https://osu.ppy.sh/users/${scope.row.user.osuId}`" target="_blank">
              <el-button type="primary" size="small" link>osu profile</el-button>
            </a>
            |
            <router-link :to="{ name: 'user-profile', params: { userId: scope.row.user.id } }"
              >osuHow profile
            </router-link>
          </template>
        </el-table-column>

        <el-table-column
          label="request for"
          :filter-method="filterRequests"
          :filters="[{ text: 'Mappooler', value: 'Mappooler' }]"
        ></el-table-column>

        <el-table-column label="actions" align="right" min-width="100%">
          <template #default="scope">
            <el-tooltip content="accept" placement="left">
              <el-button type="success" size="small" round m="l">
                <i-ic:round-check />
              </el-button>
            </el-tooltip>

            <el-tooltip content="remove" placement="right">
              <el-button type="danger" size="small" round m="l-1"><i-akar-icons:cross /> </el-button>
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
