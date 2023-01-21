import service from '~/api/http';
import { DraftDto, Draft } from '~/types';

const DraftApi = {
  create: (draftDto: DraftDto) => service.post<Draft>(`/draft`, draftDto),
  // pass params for guard check
  update: (draftDto: Partial<DraftDto>, draftId: number, params?: { userId: number }) =>
    service.put<Draft>(`/draft/${draftId}`, draftDto),
  fetch: (draftId: number) => service.get<Draft>(`/draft/${draftId}`),
  fetchCollection: () => service.get<Draft[]>(`/draft`),
};

export default DraftApi;
