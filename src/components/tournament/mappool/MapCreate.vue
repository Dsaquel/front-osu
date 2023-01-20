<script setup lang="ts">
import dayjs from 'dayjs';
import { QualifierMappool, TournamentMappool } from '~/types';

const { fetchBeatmap, createMap } = mapStore();
const { beatmap } = storeToRefs(mapStore());

const props = defineProps<{
  qualifierMappool?: QualifierMappool;
  tournamentMappool?: TournamentMappool;
}>();

const showCreate = ref(false);
const options = ['noMod', 'hidden', 'hardRock', 'doubleTime', 'freeMod', 'tieBreaker'];
const optionValue = ref<string | undefined>(undefined);
const mapInput = ref<string>('');
let loading = $ref(false);
const errorInput = ref('');

async function searchBeatmap() {
  try {
    new URL(mapInput.value);
    if (new URL(mapInput.value).origin !== 'https://osu.ppy.sh') return;
    // const firstId = mapInput.value.split('/')[4].split('#')[0];
    const beatmapId = mapInput.value.split('#')[1].split('/')[1];
    await fetchBeatmap(+beatmapId);
  } catch (_) {
    errorInput.value = 'Give me url from the map';
  }
}

async function addMap() {
  if (!beatmap.value || !optionValue.value) return;
  if (!props.qualifierMappool && !props.tournamentMappool) return;
  loading = true;
  try {
    await createMap(
      {
        beatmapsetId: beatmap.value.beatmapset_id,
        beatmapId: beatmap.value.id,
        qualifierId: props.qualifierMappool?.qualifierId,
        tournamentId: props.tournamentMappool?.tournamentId,
        type: optionValue.value,
      },
      props.qualifierMappool?.id ?? (props.tournamentMappool?.id as number),
    );
  } catch (_) {
    //
  } finally {
    showCreate.value = false;
    loading = false;
  }
}

function resetSettings() {
  optionValue.value = undefined;
  mapInput.value = '';
  beatmap.value = undefined;
}
</script>

<template>
  <el-button type="success" plain @click="showCreate = true">add new map</el-button>

  <el-dialog
    v-model="showCreate"
    :title="
      tournamentMappool?.round ? `Create map for round ${tournamentMappool.round}` : `Create map for the qualifier`
    "
    w="5/10 min-[600px]"
    class="<sm:min-w-full"
    @close="resetSettings"
  >
    <div display="grid" grid="cols-2 gap-2" justify="items-center">
      <el-input
        v-model="mapInput"
        placeholder="https://osu.ppy.sh/beatmapsets/1813899#osu/3911471"
        size="large"
        @input="searchBeatmap"
      />
      <div>
        <el-select v-model="optionValue" size="large" placeholder="mods">
          <el-option v-for="(item, v) in options" :key="v" :value="item" />
        </el-select>
      </div>
      <div v-if="beatmap" grid="col-span-2" w="full">
        <el-descriptions
          direction="horizontal"
          :title="`${beatmap.beatmapset?.artist} - ${beatmap.beatmapset.title} `"
          :column="2"
          border
        >
          <!-- <img :src="beatmap.beatmapset.covers.list" /> -->
          <el-descriptions-item :span="2" label-class-name="hide-label" class-name="img-content">
            <el-image loading="lazy" :src="beatmap.beatmapset.covers['slimcover@2x']" />
          </el-descriptions-item>

          <el-descriptions-item :span="2" label="Version"> {{ beatmap.version }}</el-descriptions-item>
          <el-descriptions-item :span="2">
            <template #label>
              <div class="description-item"><i-material-symbols:star /></div>
            </template>
            {{ beatmap.difficulty_rating }}
          </el-descriptions-item>

          <el-descriptions-item :span="2">
            <template #label>
              <div class="description-item"><i-material-symbols:circle />Circle size</div>
            </template>
            {{ beatmap.cs }}
          </el-descriptions-item>

          <el-descriptions-item :span="2" label="Approche rate"> {{ beatmap.ar }}</el-descriptions-item>

          <el-descriptions-item :span="2">
            <template #label>
              <div class="description-item"><i-mdi:bpm /> Bpm</div>
            </template>
            {{ beatmap.bpm }}
          </el-descriptions-item>

          <el-descriptions-item :span="2" width="300px">
            <template #label>
              <div class="description-item"><i-mdi:clock-time-eight /> Length</div>
            </template>
            {{ dayjs().startOf('day').second(beatmap.total_length).format('m:s') }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button :disabled="loading" @click="showCreate = false">Cancel</el-button>
        <el-button :loading="loading" type="primary" :disabled="!beatmap || !optionValue" @click="addMap"
          >{{ loading ? 'Adding...' : 'Add beatmap' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.hide-label) {
  display: none;
  width: 0;
}
:deep(.img-content) {
  padding: 0 !important;
}

:deep(.el-image) {
  display: block;
}

:deep(.description-item) {
  display: flex;
  align-items: center;
  :first-child {
    margin-right: 6px;
  }
}

:deep(td) {
  white-space: nowrap;
}
</style>
