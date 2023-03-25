<script setup lang="ts">
import { ParticipantInvitation } from '~/types';

defineProps<{
  invitationsFromTeams: ParticipantInvitation[];
}>();

const dropdown = ref();

function openDropdown() {
  dropdown.value.handleOpen();
}
</script>

<template>
  <el-badge
    v-if="invitationsFromTeams"
    :value="invitationsFromTeams.length === 0 ? undefined : invitationsFromTeams.length"
    :max="5"
  >
    <el-dropdown ref="dropdown" trigger="contextmenu">
      <i-mdi:bell class="!outline-none" @click="openDropdown" />
      <template #dropdown>
        <div p="4" w="75">
          <el-table :data="invitationsFromTeams" :max-height="250">
            <el-table-column label="id"></el-table-column>
          </el-table>
        </div>
      </template>
    </el-dropdown>
  </el-badge>
</template>
