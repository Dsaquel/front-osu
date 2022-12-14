<script setup lang="ts"></script>

<template>
  <div m="x-auto" class="card sm:max-w-1200px">
    <div p="6" grid="~ rows-2 gap-6" m="b-6">
      <label for="name">
        <span text="sm"> Name </span>
        <input
          type="text"
          name="name"
          class="mt-1 px-3 py-2 border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
          placeholder="name"
        />
      </label>
      <label for="numberOfParticipant">
        <span text="sm"> Nombre de participant max </span>
        <select
          type="text"
          name="numberOfParticipant"
          class="mt-1 px-3 py-2 border shadow-sm border-slate-300  focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
          placeholder="16"
        >
          <option p="2">4</option>
          <option p="2">16</option>
          <option p="2">32</option>
        </select>
      </label>
      <div>
        <span text="sm">Description</span>
        <MarkdownTextarea />
      </div>
    </div>
  </div>
</template>
