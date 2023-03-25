<script setup lang="ts">
import { Bell } from '@element-plus/icons-vue';
import { ParticipantInvitation } from '~/types';

defineProps<{
  invitationsFromTeams: ParticipantInvitation[];
}>();
</script>

<template>
  <el-badge :value="invitationsFromTeams.length === 0 ? undefined : invitationsFromTeams.length" :max="5">
    <el-button :icon="Bell" circle size="large" />
  </el-badge>
</template>
