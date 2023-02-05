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

  return { qualifier, fetchQualifier, createLobby, fetchQualifierLobbies };
});

export default useQualifierStore;
