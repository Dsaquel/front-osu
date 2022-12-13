<script setup lang="ts">
import zhCn from 'element-plus/lib/locale/lang/zh-cn';

onMounted(() => {
  if (userStore().user) return;
  userStore().fetch();
});
const locale = zhCn;
</script>

<template>
  <el-config-provider :locale="locale">
    <LayoutSystem />
  </el-config-provider>
</template>
