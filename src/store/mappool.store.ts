import { defineStore } from 'pinia';
import apiMappool from '~/api/modules/api.mappool';
import { TournamentMappool, QualifierMappool, CreateMappoolDto, UpdateMappoolDto } from '~/types';

const useMappoolStore = defineStore('mappool', () => {
  const typeOrder = ['noMod', 'hidden', 'hardRock', 'doubleTime', 'freeMod', 'tieBreaker'];
  const tournamentMappools = ref(undefined as TournamentMappool[] | undefined);
  const qualifierMappool = ref(undefined as QualifierMappool | undefined);

  const tournamentMappoolsSort = computed(() => {
    if (!tournamentMappools.value) return undefined;
    return tournamentMappools.value
      .map((elem) => ({
        ...elem,
        maps: elem.maps.sort((a, b) =>
          a.type !== b.type ? typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type) : a.numberOfType - b.numberOfType,
        ),
      }))
      .sort((a, b) => a.round - b.round);
  });

  const qualifierMappoolSort = computed(() => {
    if (!qualifierMappool.value) return undefined;
    qualifierMappool.value.maps.sort((a, b) =>
      a.type !== b.type ? typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type) : a.numberOfType - b.numberOfType,
    );
    return qualifierMappool.value;
  });

  async function fetchTournamentMappools(tournamentId: number) {
    try {
      const data = await apiMappool.fetchTournamentMappools(tournamentId);
      tournamentMappools.value = data;
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchQualifierMappool(qualifierId: number) {
    try {
      const data = await apiMappool.fetchQualifierMappool(qualifierId);
      qualifierMappool.value = data;
    } catch (e) {
      console.log(e);
    }
  }

  async function updateQualifierMappool(qualifierId: number, mappoolId: number, updateMappoolDto: UpdateMappoolDto) {
    try {
      const data = await apiMappool.updateQualifierMappool(qualifierId, mappoolId, updateMappoolDto);
      tournamentMappools.value = data;
    } catch (e) {
      console.log(e);
    }
  }

  async function createTournamentMappool(tournamentId: number, createMappoolDto: CreateMappoolDto) {
    try {
      const data = await apiMappool.createTournamentMappool(tournamentId, createMappoolDto);
      tournamentMappools.value = data;
    } catch (e) {
      console.log(e);
    }
  }

  async function updateTournamentMappool(tournamentId: number, mappoolId: number, updateMappoolDto: UpdateMappoolDto) {
    try {
      const data = await apiMappool.updateTournamentMappool(tournamentId, mappoolId, updateMappoolDto);
      tournamentMappools.value = data;
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteTournamentMappool(tournamentId: number, mappoolId: number) {
    try {
      const data = await apiMappool.deleteTournamentMappool(tournamentId, mappoolId);
      tournamentMappools.value = data;
    } catch (e) {
      console.log(e);
    }
  }

  return {
    tournamentMappools: tournamentMappoolsSort,
    qualifierMappool: qualifierMappoolSort,
    fetchTournamentMappools,
    fetchQualifierMappool,
    updateQualifierMappool,
    createTournamentMappool,
    updateTournamentMappool,
    deleteTournamentMappool,
  };
});

export default useMappoolStore;
