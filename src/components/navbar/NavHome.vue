<script setup>
import vitecamp from '~/assets/svg/vitecamp.svg?component';

const signIn = () => {
  window.open(import.meta.env.VITE_OSU_CONDITION, '_blank').focus();
};

const { user } = userStore();
</script>

<template>
  <div flex="~" justify="center">
    <div flex="~" justify="between" container="~">
      <div flex="~" align="items-center">
        <vitecamp m="r-2" />
        <div>OsuHow</div>
      </div>
      <UserAvatar v-if="user" :src="unref(user).avatarUrl" />
      <button v-else class="osu-background" p="2" rounded="rounded-2xl" @click="signIn">Se connecter avec osu!</button>
    </div>
  </div>
</template>

<style lang="scss">
.osu-background {
  background: var(--c-color-osu);
}
</style>
