<script setup lang="ts">
import { Dictionary } from 'lodash';
import { Match } from '~/types';

const props = defineProps<{
  lowerBracketMatches: Dictionary<Match[]>;
}>();
</script>

<template>
  <div v-if="lowerBracketMatches" class="tournament-bracket tournament-bracket--rounded">
    <div
      v-for="(matchesLower, i) in Object.fromEntries(Object.entries(lowerBracketMatches).sort())"
      :key="i"
      class="tournament-bracket__round"
    >
      <h3 class="tournament-bracket__round-title">les nuls</h3>
      <ul class="tournament-bracket__list">
        <li v-for="(match, z) in matchesLower" :key="z" class="tournament-bracket__item">
          <BracketMatch :match="match" />
        </li>
      </ul>
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
  margin-left: -7px;
  flex: 1;
}

.items-row {
  flex: 2;
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

.last-items-row {
  flex-wrap: nowrap;
  transform: translateY(20px);
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
  &:nth-child(odd) {
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
    .tournament-bracket__round:last-child & {
      &:first-child::after {
        border-radius: 0;
        height: 0;
      }
      &:last-child {
        transform: translateX(-3%);
      }
      &:last-child::after {
        display: none;
      }
    }

    .tournament-bracket__round:nth-last-child(2) & {
      &::after {
        border-radius: 0;
        height: 15px;
      }
    }
  }

  @media (min-width: $breakpoint-lg) {
    padding: 0.5em 0.8em;

    &::after {
      width: 1.5em;
    }
  }
}
</style>
