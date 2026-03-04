<template>
  <div class="item-card escambo-card">
    <ItemCarousel :photos="item.photos || []" />
    <div class="item-card__body p-3">
      <h5 class="item-card__title mb-1">{{ item.title }}</h5>
      <span class="badge bg-success me-2">{{ item.category }}</span>
      <span class="badge bg-secondary">{{ conditionLabel }}</span>
      <p class="item-card__desc mt-2 mb-2">{{ item.description }}</p>
      <p class="item-card__trade text-muted mb-0">
        <strong>Troca por:</strong> {{ item.trade_for || 'Qualquer coisa' }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import ItemCarousel from './ItemCarousel.vue';

const props = defineProps({
  item: { type: Object, required: true },
});

const conditions = {
  novo: 'Novo',
  seminovo: 'Seminovo',
  usado: 'Usado',
  desgastado: 'Desgastado',
};

const conditionLabel = computed(() => conditions[props.item.condition] || props.item.condition);
</script>

<style scoped lang="scss">
.item-card {
  overflow: hidden;

  &__title {
    font-size: 1.1rem;
    font-weight: 700;
  }

  &__desc {
    font-size: 0.9rem;
    color: #555;
    line-height: 1.4;
  }

  &__trade {
    font-size: 0.85rem;
  }
}
</style>
