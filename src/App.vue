<script setup lang="ts">
import en from 'element-plus/lib/locale/lang/en';

onMounted(() => {
  if (userStore().user) return;
  userStore().fetch();
});
const locale = en;
</script>

<template>
  <el-config-provider :locale="locale">
    <LayoutSystem />
  </el-config-provider>
</template>
