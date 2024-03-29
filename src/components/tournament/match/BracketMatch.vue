<script setup lang="ts">
import { Match, ParticipantIndividual, ParticipantTeam } from '~/types';

const { matchPlayerIdOver } = storeToRefs(matchStore());

defineProps<{
  match: Match;
  playerIdOver?: number;
}>();

const showMatchDetail = ref(false);

function mouseUp(playerId: number | undefined) {
  matchPlayerIdOver.value = playerId;
}

function getPlayerName(participant: ParticipantIndividual | ParticipantTeam | null) {
  if (!participant) return '';
  if ('user' in participant) {
    return participant.user.username;
  }
  return participant.name;
}
</script>

<template>
  <div class="match has-identifier reportable" v-bind="useAttrs()" tabindex="0" @click.prevent="showMatchDetail = true">
    <div class="match-affix-wrapper">
      <div class="match-section match-section-top">
        <div class="matchSectionWrapper">
          <div
            class="match-player entrant hover:!bg-yellow-900"
            :class="{ '!bg-yellow-900': playerIdOver === match.player1Id }"
          >
            <div
              class="match-player-name"
              :class="{
                'match-winner-player-name': match.winnerId === match.player1Id,
              }"
              @mouseover="mouseUp(match.player1Id ?? undefined)"
              @mouseleave="mouseUp(undefined)"
            >
              <div class="flex-item-grower text-ellipsis">
                <span class="match-player-name-container">{{ getPlayerName(match.player1) }}</span>
              </div>
            </div>
            <div class="match-player-info">
              <div
                class="match-player-stocks"
                :class="{
                  'winner-stocks': match.winnerId && match.winnerId === match.player1Id,
                }"
              >
                {{ match.state === 'pending' ? '' : match.player1Score }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="match-spacer"></div>
      <div class="match-section match-section-bottom">
        <div class="matchSectionWrapper">
          <div
            class="match-player entrant hover:!bg-yellow-900"
            :class="{ '!bg-yellow-900': playerIdOver === match.player2Id }"
          >
            <div
              class="match-player-name"
              :class="{
                'match-winner-player-name': match.winnerId === match.player2Id,
              }"
              @mouseover="mouseUp(match.player2Id ?? undefined)"
              @mouseleave="mouseUp(undefined)"
            >
              <div class="flex-item-grower text-ellipsis">
                <span class="match-player-name-container">{{ getPlayerName(match.player2) }}</span>
              </div>
            </div>
            <div class="match-player-info">
              <div
                class="match-player-stocks"
                :class="{
                  'winner-stocks': match.winnerId && match.winnerId === match.player2Id,
                }"
              >
                {{ match.state === 'pending' ? '' : match.player2Score }}
              </div>
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
  background: #2d2d2d;
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
  color: #fbfbfb;
}
.match-player-info {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
}
.winner-stocks {
  background: #22b24c !important;
  color: #fff;
}

.match-winner-player-name {
  font-weight: 700;
}

.match-player-stocks {
  width: 17px;
  height: 100%;
  background: #282828;
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
