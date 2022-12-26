import { defineStore } from 'pinia';
import { DraftDto, Draft } from '~/types';
import apiDraft from '~/api/modules/api.draft';

const useDraftStore = defineStore('draft', () => {
  const { user } = userStore();
  const draft = ref(undefined as Draft | undefined);
  const drafts = ref<Draft[]>([]);

  const getter = computed(() => draft.value);

  // function store(data: Draft[]) {}

  async function fetchCollection() {
    const data = await apiDraft.fetchCollection({ userId: user?.id as number });
    drafts.value = data;
  }

  async function fetch(draftId: number) {
    const data = await apiDraft.fetch({ userId: user?.id as number }, draftId);
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

  return { draft, drafts, getter, fetchCollection, fetch, create, update };
});

export default useDraftStore;
