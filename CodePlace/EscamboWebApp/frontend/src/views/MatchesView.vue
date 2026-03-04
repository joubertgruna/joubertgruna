<template>
  <div class="matches-view p-3">
    <h5 class="fw-bold mb-3">Seus Matches</h5>

    <div v-if="matchesStore.loading" class="text-center py-5">
      <div class="spinner-border text-success"></div>
    </div>

    <div v-else-if="matchesStore.matches.length === 0" class="text-center py-5">
      <p class="text-muted">Nenhum match ainda 🔄</p>
      <p class="text-muted small">Continue curtindo itens para encontrar trocas!</p>
    </div>

    <div v-else>
      <MatchCard
        v-for="match in matchesStore.matches"
        :key="match.id"
        :match="match"
        class="mb-2"
        @click="goToMatch(match)"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMatchesStore } from '@/stores/matches';
import MatchCard from '@/components/match/MatchCard.vue';

const router = useRouter();
const matchesStore = useMatchesStore();

onMounted(() => {
  matchesStore.fetchMatches();
});

const goToMatch = (match) => {
  router.push(`/match/${match.id}`);
};
</script>

<style scoped lang="scss">
.matches-view {
  padding-bottom: 80px;
}
</style>
