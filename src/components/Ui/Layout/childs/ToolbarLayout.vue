<script setup lang="ts">
import { User } from '~/types';
import { isDark, toggleDark } from '~/utils/dark';

defineProps<{
  user: User | null;
}>();

const open = ref(false);
const wrapper = ref(null);

function signIn() {
  window.open(
    import.meta.env.PROD ? import.meta.env.VITE_OSU_PROD_CALLBACK_URL : import.meta.env.VITE_OSU_DEV_CALLBACK_URL,
    '_self',
  );
}
async function logout() {
  await authStore().logout();
  document.cookie = 'cookie=; Max-Age=0';
  window.location.reload();
}

onClickOutside(wrapper, () => {
  open.value = false;
});
</script>

<template>
  <div bg="">Logo</div>
  <header display="flex" z="2" align="items-center" justify="between" p="x-6 y-12" shadow=" current">
    <div flex="grow" />

    <el-tooltip :content="isDark ? 'change light' : 'change dark'" placement="top">
      <button class="icon-btn mr-6 !outline-none" @click="toggleDark()">
        <i-ph-cloud-moon-bold v-if="isDark" class="icon-footer" />
        <i-ph-sun-horizon-bold v-else class="icon-footer" />
      </button>
    </el-tooltip>

    <div v-if="user" ref="wrapper" pos="relative">
      <el-card shadow="hover" cursor="pointer" @click="open = !open">
        <div flex="~" align="items-center">
          <el-avatar :src="user.avatarUrl" w="15" h="15" />
          <div class="<sm:hidden" m="l-2">{{ user.username }}</div>
        </div>
      </el-card>

      <div
        v-if="open"
        pos="absolute"
        class="top-full right-0"
        bg="white"
        border="1 gray-300 rounded"
        p="x-3 y-5"
        text="right"
      >
        <router-link :to="`/users/${user.id}`" class="bare" p="1">profil</router-link>
        <button class="bare" p="1" @click="logout">logout</button>
      </div>
    </div>

    <button v-else class="osu-background" p="2" rounded="rounded-2xl" @click="signIn">Sigin with osu!</button>
  </header>
</template>

<style scoped lang="scss">
header {
  .osu-background {
    background: var(--c-color-osu);
  }
}
</style>
