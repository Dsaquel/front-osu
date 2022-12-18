import { defineStore } from 'pinia';
import { DraftDto, Draft } from '~/types';
import apiDraft from '~/api/modules/api.draft';

const useDraftStore = defineStore('draft', () => {
  const { user } = userStore();
  const draft = ref<Draft[]>([]);

  function store(data: Draft[]) {
    draft.value.push(...data);
  }

  async function fetch() {
    const data = await apiDraft.fetchDraft({ userId: user?.id as number });
    store(data);
  }

  async function create(draftDto: DraftDto) {
    await apiDraft.create(draftDto);
  }

  return { draft, fetch, create };
});

export default useDraftStore;
