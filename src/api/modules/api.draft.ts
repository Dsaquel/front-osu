import service from '~/api/http';
import { DraftDto, Draft } from '~/types';

const DraftApi = {
  create: (draftDto: DraftDto) => service.post<Draft>(`/tournament/draft`, draftDto),
  fetch: (params: { userId: number }, id: number) => service.get<Draft>(`/tournament/draft/${id}`, { params }),
  fetchCollection: (params: { userId: number }) => service.get<Draft[]>(`/tournament/draft`, { params }),
};

export default DraftApi;
