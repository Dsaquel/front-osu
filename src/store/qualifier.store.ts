import { defineStore } from 'pinia';
import apiQualifier from '~/api/modules/api.qualifier';
import { Qualifier, Lobby, UpdateLobbyDto, QualifierMap, QualifierParticipant } from '~/types';

const useQualifierStore = defineStore('qualifier', () => {
  const qualifier = ref(undefined as Qualifier | undefined);
  const lobbies = ref(undefined as Lobby[] | undefined);
  const mapsScore = ref(undefined as QualifierMap[] | undefined);
  const participantsRanking = ref(undefined as QualifierParticipant[] | undefined);

  async function fetchQualifier(tournamentId: number) {
    try {
      const data = await apiQualifier.fetchByTournamentId(tournamentId);
      qualifier.value = data;
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchQualifierLobbies(qualifierId: number) {
    try {
      const data = await apiQualifier.fetchQualifierLobbies(qualifierId);
      lobbies.value = data;
    } catch (e) {
      console.log(e);
    }
  }

  async function createLobby(qualifierId: number, schedule: string) {
    const notification = await apiQualifier.createLobby(qualifierId, schedule);
    fetchQualifierLobbies(qualifierId);
    return notification;
  }

  async function updateLobby(lobbyId: number, qualifierId: number, updateLobbyDto: UpdateLobbyDto) {
    const data = await apiQualifier.updateLobby(qualifierId, lobbyId, updateLobbyDto);
    lobbies.value = data;
  }

  async function deleteLobby(qualifierId: number, lobbyId: number) {
    const data = await apiQualifier.deleteLobby(qualifierId, lobbyId);
    lobbies.value = data;
  }

  async function addParticipantToLobby(lobbyId: number, qualifierId: number) {
    const data = await apiQualifier.addParticipantToLobby(lobbyId, qualifierId);
    lobbies.value = data;
  }

  async function updateScoresLobby(matchId: number, qualifierId: number) {
    await apiQualifier.updateScoresLobby(qualifierId, matchId);
  }

  async function fetchMapsScore(qualifierId: number) {
    const data = await apiQualifier.fetchMapsScore(qualifierId);
    mapsScore.value = data;
  }

  async function fetchParticipantsRanking(qualifierId: number) {
    const data = await apiQualifier.fetchParticipantsRanking(qualifierId);
    participantsRanking.value = data;
  }

  return {
    qualifier,
    lobbies,
    mapsScore,
    participantsRanking,
    fetchQualifier,
    createLobby,
    fetchQualifierLobbies,
    addParticipantToLobby,
    updateLobby,
    deleteLobby,
    updateScoresLobby,
    fetchMapsScore,
    fetchParticipantsRanking,
  };
});

export default useQualifierStore;
