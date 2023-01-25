<script lang="ts" setup>
import { onBeforeMount } from 'vue';

const router = useRouter();
const { fetchStaff } = tournamentStore();

const props = defineProps<{
  tournamentId: number;
}>();

async function init() {
  fetchStaff(props.tournamentId);
}

onBeforeMount(async () => {
  init();
});

const goRequests = () => {
  router.push({
    name: 'tournament-requests',
    params: { tournamentId: props.tournamentId },
  });
};
</script>

<template>
  <div >
    <div>tournament staff desu</div>
    <el-button @click="goRequests">see requestes</el-button>
  </div>
</template>
