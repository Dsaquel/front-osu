import { defineStore } from 'pinia';
import { DraftDto, Draft } from '~/types';
import apiDraft from '~/api/modules/api.draft';

const useDraftStore = defineStore('draft', () => {
  const draft = ref(undefined as Draft | undefined);
  const drafts = ref<Draft[]>([]);

  async function fetchDraftsCollection() {
    const data = await apiDraft.fetchCollection();
    drafts.value = data;
  }

  async function fetchDraft(draftId: number) {
    const data = await apiDraft.fetch(draftId);
    draft.value = data;
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

  return { draft, drafts, fetchDraftsCollection, fetchDraft, create, update };
});

export default useDraftStore;
