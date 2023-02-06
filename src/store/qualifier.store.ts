import { defineStore } from 'pinia';
import apiQualifier from '~/api/modules/api.qualifier';
import { Qualifier, Lobby } from '~/types';

const useQualifierStore = defineStore('qualifier', () => {
  const qualifier = ref(undefined as Qualifier | undefined);
  const lobbies = ref(undefined as Lobby[] | undefined);

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

  async function addParticipantToLobby(lobbyId: number, qualifierId: number) {
    const data = await apiQualifier.addParticipantToLobby(lobbyId, qualifierId);
    lobbies.value = data;
  }

  async function deleteLobby(lobbyId: number, qualifierId: number) {
    const data = await apiQualifier.deleteLobby(lobbyId, qualifierId);
    lobbies.value = data;
  }

  return { qualifier, lobbies, fetchQualifier, createLobby, fetchQualifierLobbies, addParticipantToLobby, deleteLobby };
});

export default useQualifierStore;
