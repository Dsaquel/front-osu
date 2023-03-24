<script setup lang="ts">
const showDialog = ref(false);
const activeTab = ref('detail');

function resetData() {
  //
}
</script>

<template>
  <el-button type="primary" round @click="showDialog = true">manage</el-button>

  <el-dialog v-model="showDialog" title="Manage your team" w="5/10 min-[600px]" align-center @closed="resetData">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="Detail" name="detail">detail</el-tab-pane>
      <el-tab-pane label="Invitations" name="invitations">invitations</el-tab-pane>
      <el-tab-pane label="Requests" name="requests">requests</el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
