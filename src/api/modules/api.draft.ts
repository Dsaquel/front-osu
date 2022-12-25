import service from '~/api/http';
import { DraftDto, Draft } from '~/types';

const DraftApi = {
  create: (draftDto: DraftDto) => service.post<Draft>(`/draft`, draftDto),
  // pass params for guard check
  update: (draftDto: Partial<DraftDto>, draftId: number, params?: { userId: number }) =>
    service.put<Draft>(`/draft/${draftId}`, draftDto),
  fetch: (params: { userId: number }, draftId: number) => service.get<Draft>(`/draft/${draftId}`, { params }),
  fetchCollection: (params: { userId: number }) => service.get<Draft[]>(`/draft`, { params }),
};

export default DraftApi;
