import service from '~/api/http';
import { Beatmap, CreateMapDto } from '~/types';

const MapApi = {
  fetchOne: (beatmapId: number) => service.get<Beatmap>(`/beatmap/${beatmapId}`),
  createMap: (createMapDto: CreateMapDto, mappoolId: number) =>
    service.post<Beatmap>(`/mappool/${mappoolId}/map`, createMapDto),
  // fetchAll: () => ,
};

export default MapApi;
