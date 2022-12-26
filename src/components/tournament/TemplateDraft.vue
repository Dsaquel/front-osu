<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const props = defineProps<{
  name?: string;
  details?: string | null;
  rangePlayerMax?: number | null;
  rangePlayerMin?: number | null;
  numbersPlayers?: number | null;
  estimateStartDate?: string | null;
  type?: 'standard' | 'taiko';
}>();

defineEmits([
  'update:name',
  'update:details',
  'update:rangePlayerMax',
  'update:rangePlayerMin',
  'update:numbersPlayers',
  'update:estimateStartDate',
  'update:type',
]);

const rankRang = computed(() =>
  (props.rangePlayerMin === 1 || props.rangePlayerMin === null) && props.rangePlayerMax === null
    ? 'Open rank'
    : `${props.rangePlayerMin} to ${props.rangePlayerMax}`,
);
</script>

<template>
  <div m="x-auto" class="card sm:max-w-900px">
    <div p="10" grid="~ rows-1 cols-2 gap-6">
      <div>
        <span display="block" text="sm"> Name </span>
        <el-input :model-value="name" size="large" @input="(val) => $emit('update:name', val)" />
      </div>

      <div text="right">
        <span display="block" text="sm"> Number of players max </span>
        <el-select
          :model-value="(numbersPlayers as number)"
          size="large"
          w="full"
          @change="(val) => $emit('update:numbersPlayers', val)"
        >
          <el-option :value="4" />
          <el-option :value="16" />
          <el-option :value="32" />
        </el-select>
      </div>
      <div grid="col-span-2">
        <span text="sm">Details</span>
        <MarkdownTextarea :details="details" @input="(val) => $emit('update:details', val.target.value)" />
      </div>
      <CommonDatepicker
        :model-value="estimateStartDate"
        :title="'Estimation start'"
        :type="'month'"
        @update:model-value="(val) => $emit('update:estimateStartDate', dayjs(val).utc().format())"
      />
      <div grid="~ cols-2">
        <div m="x-2">
          <span display="block" text="sm">player rank mini</span>
          <el-input-number
            :model-value="rangePlayerMin"
            size="large"
            :min="1"
            :value-on-clear="1"
            :step="100"
            @input="(val) => $emit('update:rangePlayerMin', val)"
          />
        </div>
        <div m="x-2">
          <span display="block" text="right sm">player rank max</span>
          <el-input-number
            :model-value="rangePlayerMax"
            size="large"
            :value-on-clear="null"
            @input="(val) => $emit('update:rangePlayerMax', val)"
          />
        </div>
        <div grid="col-span-2" text="center" m="t-5">
          rank range:
          {{ rankRang }}
        </div>
      </div>
      <slot name="last" />
    </div>
  </div>
</template>
