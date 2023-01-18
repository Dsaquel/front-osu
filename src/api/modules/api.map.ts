import service from '~/api/http';
import { Beatmap, CreateMapDto, MapParams } from '~/types';

const MapApi = {
  fetchOne: (beatmapId: number) => service.get<Beatmap>(`/beatmap/${beatmapId}`),
  createMap: <T>(createMapDto: CreateMapDto, mappoolId: number) =>
    service.post<T>(`/mappool/${mappoolId}/map`, createMapDto),
  refreshDataBeatmap: (mappoolId: number, mapId: number, mapParams: MapParams) =>
    service.put(`/mappool/${mappoolId}/map/${mapId}`, mapParams),
  deleteOne: (mappoolId: number, mapId: number, mapParams: MapParams) =>
    service.delete(`/mappool/${mappoolId}/map/${mapId}`, mapParams),
};

export default MapApi;
