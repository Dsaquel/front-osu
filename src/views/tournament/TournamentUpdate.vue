<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { isEqual } from 'lodash';
import router from '~/router';
import { TournamentType } from '~/types';

dayjs.extend(utc);

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
const { fetchTournament, updateTournament } = tournamentStore();
const { tournament } = storeToRefs(tournamentStore());

const initLoading = ref(false);
let loading = $ref(false);

async function init() {
  try {
    await fetchTournament(tournamentId);
  } catch (e) {
    console.log('init error', e);
  }
}

onBeforeMount(async () => {
  initLoading.value = true;
  await init();
  initLoading.value = false;
});

const rankRang = computed(() =>
  ((tournament?.value?.rangePlayerMin === 1 || tournament?.value?.rangePlayerMin === null) &&
    tournament?.value.rangePlayerMax === null) ||
  (tournament?.value?.rangePlayerMin === undefined && tournament?.value?.rangePlayerMax === undefined)
    ? 'Open rank'
    : `${tournament?.value.rangePlayerMin} to ${tournament?.value.rangePlayerMax}`,
);

const timeout = useTimeoutFn(
  async () => {
    if (!tournament.value) return;
    loading = true;
    await updateTournament({
      name: tournament.value?.name,
      numbersPlayers: tournament.value?.numbersPlayers ?? undefined,
      startDate: tournament.value?.startDate as string,
      description: tournament.value?.description ?? '',
      rangePlayerMax: tournament.value?.rangePlayerMax,
      rangePlayerMin: tournament.value?.rangePlayerMin,
      mode: tournament.value?.mode,
      registrationEndDate: tournament.value?.registrationEndDate,
      hasQualifier: tournament.value?.hasQualifier,
      type: tournament.value?.type,
      teamNumberMin: tournament.value?.teamNumberMin,
      teamNumberMax: tournament.value?.teamNumberMax,
    });
    loading = false;
    timeout.stop();
  },
  2000,
  { immediate: false },
);

function timeoutManaging() {
  timeout.start();
  if (timeout.isPending) {
    timeout.stop();
    timeout.start();
  }
}
watch(
  () => tournament.value,
  (newVal, oldVal) => {
    if ((oldVal === undefined && newVal !== undefined) || !isEqual(newVal, oldVal)) return;
    timeoutManaging();
  },
  { deep: true },
);

const goBack = () => {
  router.push({
    name: 'home',
  });
};
</script>

<template>
  <div v-if="!initLoading">
    <div v-if="tournament">
      <div class="card" p="10" grid="~ rows-1 cols-2 gap-6">
        <div grid="col-span-2" text="center xl">Tournament settings</div>
        <div>
          <span display="block" text="sm"> Name </span>
          <el-input v-model="tournament.name" size="large" />
        </div>
        <div text="right">
          <span display="block" text="sm"> Number of players max </span>
          <el-select
            :model-value="(tournament.numbersPlayers as number)"
            size="large"
            w="full"
            @change="(val) => (tournament!.numbersPlayers = val)"
          >
            <el-option :value="4" />
            <el-option :value="8" />
            <el-option :value="16" />
            <el-option :value="32" />
          </el-select>
        </div>
        <div>
          <span display="block" text="sm"> solo or team </span>
          <el-select :model-value="tournament.type" size="large" w="full" @change="(val) => (tournament!.type = val)">
            <el-option :value="TournamentType.Solo" />
            <el-option :value="TournamentType.Team" />
          </el-select>
        </div>
        <div v-if="tournament.type === TournamentType.Team" grid="~ cols-2">
          <div m="x-2">
            <span display="block" text="sm">team number min</span>
            <el-input-number v-model="tournament.teamNumberMin" size="large" :min="2" :value-on-clear="2" :step="1" />
          </div>
          <div m="x-2">
            <span display="block" text="sm">team number max</span>
            <el-input-number v-model="tournament.teamNumberMax" size="large" :min="2" :value-on-clear="2" :step="1" />
          </div>
        </div>
        <div grid="col-span-2">
          <span text="sm">Details</span>
          <MarkdownTextarea
            :text="tournament.description"
            @update:description="(val: string) => tournament!.description = val"
          />
        </div>
        <CommonDatepicker
          :model-value="tournament.startDate"
          :title="'Start date'"
          :type="'datetime'"
          @update:model-value="(val) => (tournament!.startDate = dayjs(val).utc().format())"
        />
        <div grid="~ cols-2">
          <div m="x-2">
            <span display="block" text="sm">player rank mini</span>
            <el-input-number
              v-model="tournament.rangePlayerMin"
              size="large"
              :min="1"
              :value-on-clear="1"
              :step="100"
            />
          </div>
          <div m="x-2">
            <span display="block" text="right sm">player rank max</span>
            <el-input-number v-model="tournament.rangePlayerMax" size="large" :value-on-clear="null" />
          </div>
          <div grid="col-span-2" text="center" m="t-5">
            rank range:
            {{ rankRang }}
          </div>
        </div>
        <div>
          <CommonDatepicker
            :model-value="tournament.registrationEndDate"
            :title="'End of registration'"
            :type="'datetime'"
            @update:model-value="(val) => (tournament!.registrationEndDate = dayjs(val).utc().format())"
          />
        </div>
        <div text="right">
          <span display="block" text="sm"> mode </span>
          <el-select :model-value="tournament.mode" size="large" w="full" @change="(val) => (tournament!.mode = val)">
            <el-option value="standard" />
          </el-select>
        </div>
        <div>
          <span text="sm"> Create qualifier </span>
          <el-switch v-model="tournament.hasQualifier" />
          <router-link v-if="tournament.hasQualifier" :to="{ name: 'qualifier-detail' }" display="block"
            ><el-button>qualifier detail</el-button></router-link
          >
        </div>

        <div
          v-loading="loading"
          element-loading-background="rgba(33, 33, 33)"
          element-loading-text="Updating..."
          grid="col-end-3"
          w="min-content"
          place="self-end"
          class="whitespace-nowrap"
          :class="{ 'mb-6': loading }"
        >
          last update: {{ useTimeAgo(tournament.updateAt).value }}
        </div>
      </div>
      <div v-if="tournament.qualifier" class="card" m="t-6" p="10">
        <div text="center xl">Qualifier settings</div>

        <router-link class="bare" :to="{ name: 'mappool-manager' }">See mappool qualifier</router-link>
        <router-link class="bare" :to="{ name: 'qualifier-lobbies' }">See lobbies qualifier</router-link>
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
