<script setup lang="ts">
import { Match } from '~/types';

defineProps<{
  match: Match;
}>();
</script>

<template>
  <el-dialog v-bind="useAttrs()" append-to-body>
    <!-- voir quand est ce que le match commmence ainsi que les autres infos -->
    <!-- pouvoir edit le match "superReferee like" -->
    <!-- pouvoir reschedule -->
    toto
    <MatchUpdate />
  </el-dialog>
</template>
