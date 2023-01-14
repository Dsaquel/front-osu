import service from '~/api/http';
import { Beatmap, CreateMapDto } from '~/types';

const MapApi = {
  fetchOne: (beatmapId: number) => service.get<Beatmap>(`/beatmap/${beatmapId}`),
  createMap: <T>(createMapDto: CreateMapDto, mappoolId: number) =>
    service.post<T>(`/mappool/${mappoolId}/map`, createMapDto),
  // fetchAll: () => ,
};

export default MapApi;
