import service from '~/api/http';
import { DraftDto, Draft } from '~/types';

const DraftApi = {
  create: (draftDto: DraftDto) => service.post<Draft>(`/draft`, draftDto),
  update: (draftDto: Partial<DraftDto>, draftId: number) => service.put<Draft>(`/draft/${draftId}`, draftDto),
  updatePrivacy: (draftId: number, isPublic: boolean) => service.put<Draft>(`/draft/${draftId}`, { isPublic }),
  fetch: (draftId: number) => service.get<Draft>(`/draft/${draftId}`),
  fetchAll: () => service.get<Draft[]>(`/draft`),
};

export default DraftApi;
