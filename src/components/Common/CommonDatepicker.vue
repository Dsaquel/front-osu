<script lang="ts" setup>
const value2 = ref('');
</script>

<template>
  <div>
    <span display="block">Month</span>
    <el-date-picker v-model="value2" type="month" />
  </div>
</template>
