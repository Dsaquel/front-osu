import { defineStore } from 'pinia';
import apiQualifier from '~/api/modules/api.qualifier';
import router from '~/router';
import { Qualifier, UpdateQualifierDto } from '~/types';

const useQualifierStore = defineStore('qualifier', () => {
  const qualifier = ref(undefined as Qualifier | undefined);

  async function fetchQualifier(tournamentId: number) {
    try {
      const data = await apiQualifier.fetchByTournamentId(tournamentId);
      qualifier.value = data;
    } catch (e) {
      router.push({ name: '403' });
    }
  }

  async function fetchCollection() {
    //
  }

  async function update(updateQualifierDto: UpdateQualifierDto) {
    try {
      const data = await apiQualifier.update(updateQualifierDto, qualifier.value?.id as number);
      qualifier.value = data;
    } catch (e: Error) {
      console.log(e.message);
    }
  }

  return { qualifier, fetchQualifier, fetchCollection, update };
});

export default useQualifierStore;
