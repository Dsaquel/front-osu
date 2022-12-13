<script setup lang="ts">
import { User } from '~/types';
import { isDark, toggleDark } from '~/utils/dark';

const signIn = () => {
  window.open(import.meta.env.VITE_OSU_CONDITION, '_blank').focus();
};
defineProps<{
  user?: User;
}>();
</script>

<template>
  <div flex="~" align="items-center" p="y-2 x-6">
    <div flex="grow" />
    <div flex="~" align="self-center">
      <el-tooltip :content="isDark ? 'change light' : 'change dark'" placement="top">
        <button class="icon-btn mr-6 !outline-none" @click="toggleDark()">
          <i-ph-cloud-moon-bold v-if="isDark" class="icon-footer" />
          <i-ph-sun-horizon-bold v-else class="icon-footer" />
        </button>
      </el-tooltip>

      <button v-if="!user" class="osu-background" p="2" rounded="rounded-2xl" @click="signIn">
        Se connecter avec osu!
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.osu-background {
  background: var(--c-color-osu);
}
</style>
