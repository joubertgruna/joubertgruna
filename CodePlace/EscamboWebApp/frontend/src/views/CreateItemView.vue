<template>
  <div class="create-item-view p-3">
    <h5 class="mb-3 fw-bold">Publicar Item</h5>

    <div v-if="success" class="alert alert-success">
      ✅ Item publicado com sucesso!
    </div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <ItemForm
      :form="form"
      :loading="loading"
      submit-label="Publicar Item"
      @submit="handleSubmit"
      @update:files="files = $event"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useItemsStore } from '@/stores/items';
import ItemForm from '@/components/items/ItemForm.vue';

const router = useRouter();
const itemsStore = useItemsStore();

const form = reactive({
  title: '',
  description: '',
  category: '',
  condition: '',
  trade_for: '',
});
const files = ref([]);
const loading = ref(false);
const error = ref('');
const success = ref(false);

const handleSubmit = async () => {
  error.value = '';
  success.value = false;
  loading.value = true;
  try {
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) formData.append(key, form[key]);
    });
    files.value.forEach((file) => formData.append('photos', file));

    await itemsStore.createItem(formData);
    success.value = true;
    setTimeout(() => router.push('/feed'), 1500);
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao publicar item';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.create-item-view {
  padding-bottom: 80px;
  max-width: 500px;
  margin: 0 auto;
}
</style>
