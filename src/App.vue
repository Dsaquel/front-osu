<script setup lang="ts">
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import Cookies from 'js-cookie';

onMounted(() => {
  userStore().fetch(Cookies.get('AccessToken'));
});
const locale = zhCn;
</script>

<template>
  <div class="m-5">
    <el-config-provider :locale="locale">
      <router-view></router-view>
    </el-config-provider>
  </div>
  <TheFooter></TheFooter>
</template>
