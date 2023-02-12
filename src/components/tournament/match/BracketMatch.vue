<script setup lang="ts">
import { Match } from '~/types';

defineProps<{
  match: Match;
}>();

const showMatchDetail = ref(false);
</script>

<template>
  <div class="match has-identifier reportable" v-bind="useAttrs()" tabindex="0" @click="showMatchDetail = true">
    <div class="match-affix-wrapper">
      <div class="match-section match-section-top">
        <div class="matchSectionWrapper">
          <div class="match-player entrant winner">
            <div class="match-player-name">
              <div class="flex-item-grower text-ellipsis">
                <span class="match-player-name-container">{{ match.player1?.user.username || '' }}</span>
              </div>
            </div>
            <div class="match-player-info">
              <div class="match-player-stocks">{{ match.state === 'pending' ? '' : match.player1Score }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="match-spacer"></div>
      <div class="match-section match-section-bottom">
        <div class="matchSectionWrapper">
          <div class="match-player entrant loser">
            <div class="match-player-name">
              <div class="flex-item-grower text-ellipsis">
                <span class="match-player-name-container">{{ match.player2?.user.username || '' }}</span>
              </div>
            </div>
            <div class="match-player-info">
              <div class="match-player-stocks">{{ match.state === 'pending' ? '' : match.player2Score }}</div>
            </div>
          </div>
        </div>
      </div>
      <span class="label label-default match-label"
        ><span class="identifier-container">{{ match.identifier }}</span>
        <i-ant-design:caret-right-filled class="caret"
      /></span>
    </div>
  </div>
  <MatchDetail v-model="showMatchDetail" :match="match" />
</template>

<style scoped lang="scss">
.match {
  width: 100%;
  cursor: pointer;
}
.match-affix-wrapper {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
.match-section {
  border: 2px solid #e6e6e6;
}

.match-player {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  flex-wrap: nowrap;
  height: 22px;
  background: #fff;
  font-size: 13px;
  font-style: italic;
  font-weight: 300;
  transition: all 0.3s linear;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
}
.match-spacer {
  display: block;
  height: 0;
  width: 100%;
  border: 2px solid #e6e6e6;
  border-top: 0;
  transition: border-color 0.3s linear;
}

.match-section-bottom {
  border-top: 0;
}
.match-section-top {
  border-bottom: 0;
}

.entrant .winner {
  font-weight: 700;
}

.match-player-name {
  flex: 1 1 auto;
  padding-left: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 4px;
}

.text-ellipsis {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  flex: 1 1 100%;
}
.match-player-name-container {
  color: black;
}
.match-player-info {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
}
.winner .match-player-stocks {
  background: #22b24c;
  color: #fff;
}

.winner .match-player-name {
  font-weight: 700;
}

.loser .match-player-stocks {
  color: #fff;
  background: rgba(3, 18, 33, 0.6);
}

.match-player-stocks {
  width: 17px;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
}
.label {
  display: inline;
  padding: 0.2em 0.6em 0.3em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25em;
}
.match-label {
  position: absolute;
  top: 0;
  bottom: 0;
  height: 16px;
  margin: auto;
  color: #fff;
  background: #3b4350;
  left: -14px;
  font-size: 10px;
}

.identifier-container {
  line-height: 1.2;
}
.caret {
  position: absolute;
  right: -17px;
  color: #3b4350;
  font-size: 25px;
  top: 0;
  bottom: 0;
  margin: auto;
  height: 16px;
}
</style>
