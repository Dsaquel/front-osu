<script setup lang="ts">
import en from 'element-plus/lib/locale/lang/en';

onBeforeMount(async () => {
  const cookie = (new RegExp(`${'cookie' || '='}=(.*?); `, 'gm').exec(`${document.cookie}; `) || ['', null])[1];
  if (cookie) {
    try {
      await userStore().fetch();
    } catch (e) {
      console.log(e);
      window.open(
        import.meta.env.PROD ? import.meta.env.VITE_OSU_PROD_CALLBACK_URL : import.meta.env.VITE_OSU_DEV_CALLBACK_URL,
        '_self',
      );
    }
  }
});

const locale = en;
</script>

<template>
  <el-config-provider :locale="locale">
    <LayoutSystem />
  </el-config-provider>
</template>
