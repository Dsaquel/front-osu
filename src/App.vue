<script setup lang="ts">
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import Cookies from 'js-cookie';

onMounted(() => {
  tokenStore().token = Cookies.get('AccessToken');
  userStore().fetch();
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
