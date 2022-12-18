import { defineStore } from 'pinia';
import { DraftDto, Draft } from '~/types';
import apiDraft from '~/api/modules/api.draft';

const useDraftStore = defineStore('draft', () => {
  const { user } = userStore();
  const draft = ref<Draft | null>(null);
  const drafts = ref<Draft[]>([]);

  function store(data: Draft[]) {
    drafts.value.push(...data);
  }

  async function fetchCollection() {
    const data = await apiDraft.fetchCollection({ userId: user?.id as number });
    store(data);
  }

  async function fetch() {
    const data = await apiDraft.fetch({ userId: user?.id as number });
    draft.value = data;
  }

  async function create(draftDto: DraftDto) {
    const data = await apiDraft.create(draftDto);
    draft.value = data;
  }

  return { draft, fetchCollection, fetch, create };
});

export default useDraftStore;
