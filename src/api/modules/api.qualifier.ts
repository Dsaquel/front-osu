import service from '~/api/http';
import { UpdateQualifierDto, Qualifier } from '~/types';

const QualifierApi = {
  fetchByTournamentId: (tournamentId: number) => service.get<Qualifier>(`/qualifier/${tournamentId}`),
  update: (updateQualifierDto: UpdateQualifierDto, qualifierId: number) =>
    service.put<Qualifier>(`/qualifier/${qualifierId}`, updateQualifierDto),
};

export default QualifierApi;
