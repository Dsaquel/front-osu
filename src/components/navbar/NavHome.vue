<template>
  <div flex="~" align="content-center" justify="between">
    <div flex="~" align="items-center">
      <vitecamp m="r-2" />
      <div>OsuHow</div>
    </div>
    <!-- <router-link>click ici</router-link> -->
    <button class="osu-background" p="2" rounded="rounded-2xl" @click="signIn">Se connecter avec osu!</button>
  </div>
</template>

<script setup>
import vitecamp from '~/assets/svg/vitecamp.svg?component';

// const signIn = () => {};
</script>

<style lang="scss">
.osu-background {
  background: var(--c-color-osu);
}
</style>
