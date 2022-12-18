import service from '~/api/http';
import { DraftDto, Draft } from '~/types';

const DraftApi = {
  create: (draftDto: DraftDto) => service.post<Draft>(`/tournament/draft`, draftDto),
  fetchDraft: (params: { userId: number }) => service.get<Draft[]>(`/tournament/draft`, { params }),
};

export default DraftApi;
