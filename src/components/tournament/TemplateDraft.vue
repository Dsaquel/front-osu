<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string;
    details: string | null;
    rangePlayerMax: number | null;
    rangePlayerMin: number | null;
    numbersPlayers: number | null;
    estimateStartDate: string | null;
    type: 'standard' | 'taiko';
  }>(),
  {
    name: '',
    type: 'standard',
    details: null,
  },
);
defineEmits([
  'update:name',
  'update:details',
  'update:rangePlayerMax',
  'update:rangePlayerMin',
  'update:numbersPlayers',
  'update:estimateStartDate',
  'update:type',
]);
console.log(details);
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
          :model-value="numbersPlayers"
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
        <MarkdownTextarea :details="details" @input="(val) => $emit('update:details', val)" />
      </div>
      <CommonDatepicker
        :model-value="estimateStartDate"
        :title="'Estimation start'"
        :type="'month'"
        @input="(val) => $emit('update:estimateStartDate', val)"
      />
      <slot name="last" />
    </div>
  </div>
</template>
