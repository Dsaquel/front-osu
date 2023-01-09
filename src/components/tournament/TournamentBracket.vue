<script setup lang="ts">
import _ from 'lodash';
import { onBeforeMount } from 'vue';
import { Match, Tournament } from '~/types';

const { fetchMatches } = matchStore();
const { matches, matchesGrouped } = storeToRefs(matchStore());
const props = defineProps<{
  tournament: Tournament;
}>();

onBeforeMount(async () => {
  await fetchMatches(props.tournament.id);
});

console.log(groupBy(matchesGrouped.value, 'round'));
</script>
<template>
  <div v-if="matches" class="container">
    <div class="tournament-bracket tournament-bracket--rounded">
      <div class="tournament-bracket__round tournament-bracket__round--quarterfinals">
        <h3 class="tournament-bracket__round-title">Quarterfinals</h3>
        <ul class="tournament-bracket__list">
          <li class="tournament-bracket__item">
            <BracketMatch />
          </li>
          <li class="tournament-bracket__item">
            <BracketMatch />
          </li>
          <li class="tournament-bracket__item">
            <BracketMatch />
          </li>

          <li class="tournament-bracket__item">
            <BracketMatch />
          </li>

          <li class="tournament-bracket__item">
            <BracketMatch />
          </li>

          <li class="tournament-bracket__item">
            <BracketMatch />
          </li>
          <li class="tournament-bracket__item">
            <BracketMatch />
          </li>
          <li class="tournament-bracket__item">
            <BracketMatch />
          </li>
        </ul>
      </div>
      <div class="tournament-bracket__round tournament-bracket__round--semifinals">
        <h3 class="tournament-bracket__round-title">Semifinals</h3>
        <ul class="tournament-bracket__list">
          <li class="tournament-bracket__item">
            <BracketMatch />
          </li>
          <li class="tournament-bracket__item">
            <BracketMatch />
          </li>
          <li class="tournament-bracket__item">
            <BracketMatch />
          </li>
          <li class="tournament-bracket__item">
            <BracketMatch />
          </li>
        </ul>
      </div>
      <div class="tournament-bracket__round tournament-bracket__round--bronze">
        <h3 class="tournament-bracket__round-title">Bronze medal game</h3>
        <ul class="tournament-bracket__list">
          <li class="tournament-bracket__item">
            <BracketMatch />
          </li>
          <li class="tournament-bracket__item">
            <BracketMatch />
          </li>
        </ul>
      </div>
      <div class="tournament-bracket__round tournament-bracket__round--gold">
        <h3 class="tournament-bracket__round-title">Gold medal game</h3>
        <ul class="tournament-bracket__list">
          <li class="tournament-bracket__item">
            <BracketMatch />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$breakpoint-xs: 24em;
$breakpoint-sm: 38em;
$breakpoint-md: 52em;
$breakpoint-lg: 72em;

.tournament-bracket {
  display: flex;
  flex-direction: column;

  @media (min-width: $breakpoint-sm) {
    flex-direction: row;
  }
}

.tournament-bracket__round {
  display: block;
  margin-left: -3px;
  flex: 1;
}

.tournament-bracket__round-title {
  color: #9e9e9e;
  font-size: 0.95rem;
  font-weight: 400;
  text-align: center;
  font-style: italic;
  margin-bottom: 0.5em;
}

.tournament-bracket__list {
  display: flex;
  flex-direction: column;
  flex-flow: row wrap;
  justify-content: center;
  height: 100%;
  min-height: 100%;
  gap: 10px;
  padding-bottom: 2em;
  margin-bottom: 2em;
  border: 0;
  transition: padding 0.2s ease-in-out, margin 0.2s ease-in-out;

  @media (max-width: $breakpoint-xs) {
    padding-bottom: 1em;
    margin-bottom: 1em;
  }

  @media (min-width: $breakpoint-sm) {
    border-right-width: 1px;
    border-style: dashed;
    border-color: rgba(233, 236, 239, 0.1);
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: 0;
  }

  .tournament-bracket__round:last-child & {
    border: 0;
  }
}

.tournament-bracket__item {
  display: flex;
  flex: 0 1 auto;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  padding: 2% 0;
  width: 48%;
  transition: padding 0.2s linear;
  z &:nth-child(odd) {
    margin-right: 2%;
  }

  &:nth-child(even) {
    margin-left: 2%;
  }

  &::after {
    transition: width 0.2s linear;
  }

  @media (max-width: $breakpoint-xs) {
    width: 100%;

    &:nth-child(odd),
    &:nth-child(even) {
      margin-left: 0;
      margin-right: 0;
    }
  }

  @media (min-width: $breakpoint-sm) {
    padding: 0.5em 1em;
    flex-grow: 2;
    width: 100%;

    &:nth-child(odd),
    &:nth-child(even) {
      margin: 0;
    }

    &::after {
      position: absolute;
      right: 0;
      content: '';
      display: block;
      width: 1em;
      height: 75%;
      border-right: 2px solid #9e9e9e;
      z-index: -1;
    }

    &:nth-child(odd)::after {
      top: 50%;
      border-top: 2px solid #9e9e9e;
      transform: translateY(-1px);

      .tournament-bracket--rounded & {
        border-top-right-radius: 0.6em;
      }
    }

    &:nth-child(even)::after {
      bottom: 50%;
      border-bottom: 2px solid #9e9e9e;
      transform: translateY(1px);

      .tournament-bracket--rounded & {
        border-bottom-right-radius: 0.6em;
      }
    }
    .tournament-bracket__round:first-child & {
      padding-left: 0;
    }
    .tournament-bracket__round:last-child & {
      padding-right: 0;

      &::after {
        display: none;
      }
    }

    // .tournament-bracket__round:nth-last-child(2) & {
    //   &::after {
    //     border-radius: 0;
    //     border-right: 0;
    //   }
    // }
  }

  @media (min-width: $breakpoint-lg) {
    padding: 0.5em 0.8em;

    &::after {
      width: 1.5em;
    }
  }
}
</style>
