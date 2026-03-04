<template>
  <div class="feed-grid">
    <div class="row g-2">
      <div v-for="item in items" :key="item.id" class="col-6">
        <FeedItem :item="item" @click="$emit('select', item)" />
      </div>
    </div>

    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border spinner-border-sm text-success"></div>
    </div>

    <p v-if="!loading && items.length === 0" class="text-center text-muted py-5">
      Nenhum item disponível
    </p>
  </div>
</template>

<script setup>
import FeedItem from './FeedItem.vue';

defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});

defineEmits(['select']);
</script>

<style scoped lang="scss">
.feed-grid { padding: 8px; }
</style>
