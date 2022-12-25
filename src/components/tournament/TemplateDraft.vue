<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

defineProps<{
  name?: string;
  details?: string | null;
  rangePlayerMax?: number | null;
  rangePlayerMin?: number | null;
  numbersPlayers?: number | null;
  estimateStartDate?: string | null;
  type?: 'standard' | 'taiko';
}>();
// {
//   name: '',
//   details: '',
//   rangePlayerMax: 0,
//   rangePlayerMin: 0,
//   estimateStartDate: '',
//   numbersPlayers: 0,
//   type: 'standard',
// },

defineEmits([
  'update:name',
  'update:details',
  'update:rangePlayerMax',
  'update:rangePlayerMin',
  'update:numbersPlayers',
  'update:estimateStartDate',
  'update:type',
]);
</script>

<template>
  <div m="x-auto" class="card sm:max-w-1200px">
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
        <span text="sm">details</span>
        <MarkdownTextarea :details="details" @input="(val) => $emit('update:details', val.target.value)" />
      </div>
      <CommonDatepicker
        :model-value="estimateStartDate"
        :title="'Estimation start'"
        :type="'month'"
        @update:model-value="(val) => $emit('update:estimateStartDate', dayjs(val).utc().format())"
      />
      <slot name="last" />
    </div>
  </div>
</template>
