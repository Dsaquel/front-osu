<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
const { user } = storeToRefs(userStore());
</script>

<template>
  <div v-if="user">
    <router-link :to="{ name: 'user-tournament', params: { userId: user.id } }">
      <el-button type="primary" size="large" plain round> see tournaments </el-button>
    </router-link>
  </div>
</template>
