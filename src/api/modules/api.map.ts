import service from '~/api/http';
import { Beatmap } from '~/types';

const MapApi = {
  fetch: (beatmapId: number) => service.get<Beatmap>(`/beatmap/${beatmapId}`),
};

export default MapApi;
