import service from '~/api/http';
import { Beatmap, CreateMapDto, DeleteMapParams } from '~/types';

const MapApi = {
  fetchOne: (beatmapId: number) => service.get<Beatmap>(`/beatmap/${beatmapId}`),
  createMap: <T>(createMapDto: CreateMapDto, mappoolId: number) =>
    service.post<T>(`/mappool/${mappoolId}/map`, createMapDto),
  deleteOne: (mappoolId: number, mapId: number, deleteMapParams: DeleteMapParams) =>
    service.delete(`/mappool/${mappoolId}/map/${mapId}`, deleteMapParams),
};

export default MapApi;
