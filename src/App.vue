<script setup lang="ts">
import en from 'element-plus/lib/locale/lang/en';

onBeforeMount(() => {
  const cookie = (new RegExp(`${'cookie' || '='}=(.*?); `, 'gm').exec(`${document.cookie}; `) || ['', null])[1];
  if (cookie) {
    userStore().fetch();
  }
});

const locale = en;
</script>

<template>
  <el-config-provider :locale="locale">
    <LayoutSystem />
  </el-config-provider>
</template>
