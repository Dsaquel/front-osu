<script setup lang="ts">
const { qualifier } = storeToRefs(qualifierStore());
const { access } = storeToRefs(tournamentStore());
const { user } = storeToRefs(userStore());

const showSetScores = ref(false);
</script>

<template>
  <div v-if="qualifier && user && (access?.isAdmin || access?.isReferee || access?.isOwner)">
    <el-button m="l-1" type="primary" @click="showSetScores = true">set scores</el-button>

    <el-dialog v-model="showSetScores" v-bind="useAttrs()">
      <div display="grid" grid="cols-2 gap-2">
        <!--  -->
      </div>
      <template #footer>
        <!--  -->
      </template>
    </el-dialog>
  </div>
</template>
