<script setup lang="ts">
import { User } from '~/types';
import { isDark, toggleDark } from '~/utils/dark';

defineProps<{
  user: User | null;
}>();

const open = ref(false);
const wrapper = ref(null);

function signIn() {
  window.open(import.meta.env.VITE_OSU_CONDITION, '_blank')?.focus();
}
function logout() {
  authStore().logout();
  window.location.reload();
}

onClickOutside(wrapper, () => {
  open.value = false;
});
</script>

<template>
  <div bg="blue-600">Logo</div>
  <header display="flex" z="1" align="items-center" justify="between" p="x-6 y-12" bg="orange-500">
    <div flex="grow" />

    <el-tooltip :content="isDark ? 'change light' : 'change dark'" placement="top">
      <button class="icon-btn mr-6 !outline-none" @click="toggleDark()">
        <i-ph-cloud-moon-bold v-if="isDark" class="icon-footer" />
        <i-ph-sun-horizon-bold v-else class="icon-footer" />
      </button>
    </el-tooltip>

    <div v-if="user" ref="wrapper" pos="relative">
      <div flex="~" align="items-center" p="5" class="hover:hovered" :class="{ hovered: open }" @click="open = !open">
        <UserAvatar :src="user.avatarUrl" w="15" h="15" />
        <div m="l-2">{{ user.username }}</div>
      </div>
      <div
        v-if="open"
        pos="absolute"
        class="top-full right-0"
        bg="orange-500"
        border="1 gray-300 rounded"
        p="x-3 y-5"
        text="right"
      >
        <router-link :to="`/users/'${user.id}`" class="bare" p="1">profil</router-link>
        <button class="bare" p="1" @click="logout">logout</button>
      </div>
    </div>

    <button v-else class="osu-background" p="2" rounded="rounded-2xl" @click="signIn">Se connecter avec osu!</button>
  </header>
</template>

<style SCOPED lang="scss">
header {
  .osu-background {
    background: var(--c-color-osu);
  }
}
</style>
