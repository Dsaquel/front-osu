import { defineStore } from 'pinia';
import { DraftDto, Draft } from '~/types';
import apiDraft from '~/api/modules/api.draft';
import useTournamentStore from './tournament.store';

const useDraftStore = defineStore('draft', () => {
  const tournamentStore = useTournamentStore();
  const draft = ref(undefined as Draft | undefined);
  const drafts = ref(undefined as Draft[] | undefined);

  async function fetchDraft(draftId: number) {
    const data = await apiDraft.fetch(draftId);
    tournamentStore.tournament = data.tournament;
    draft.value = data;
  }

  async function fetchDrafts() {
    const data = await apiDraft.fetchAll();
    drafts.value = data;
  }

  async function create(draftDto: DraftDto): Promise<Draft> {
    const data = await apiDraft.create(draftDto);
    draft.value = data;
    return data;
  }

  async function update(draftDto: Partial<DraftDto>, draftId: number) {
    const data = await apiDraft.update(draftDto, draftId);
    Object.assign(draft.value as Draft, data);
  }

  async function updatePrivacy(draftId: number, isPublic: boolean) {
    const data = await apiDraft.updatePrivacy(draftId, isPublic);
    Object.assign(draft.value as Draft, data);
  }

  return { draft, drafts, fetchDraft, create, update, fetchDrafts, updatePrivacy };
});

export default useDraftStore;
