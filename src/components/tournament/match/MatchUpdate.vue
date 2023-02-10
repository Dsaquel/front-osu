<script lang="ts" setup>
const { access } = storeToRefs(tournamentStore());

const showMatchUpdate = ref(false);
</script>

<template>
  <el-button v-if="access?.isAdmin || access?.isReferee || access?.isOwner" @click="showMatchUpdate = true"
    >oui
  </el-button>
  <el-dialog v-model="showMatchUpdate" draggable> match update desu ! </el-dialog>
</template>
