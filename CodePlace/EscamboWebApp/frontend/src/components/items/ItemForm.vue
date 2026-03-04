<template>
  <form @submit.prevent="$emit('submit')" class="item-form">
    <div class="mb-3">
      <label class="form-label">Título *</label>
      <input
        v-model="form.title"
        type="text"
        class="form-control"
        placeholder="Ex: Guitarra Fender usada"
        required
        maxlength="120"
      />
    </div>

    <div class="mb-3">
      <label class="form-label">Descrição *</label>
      <textarea
        v-model="form.description"
        class="form-control"
        rows="3"
        placeholder="Descreva o item detalhadamente..."
        required
        maxlength="1000"
      ></textarea>
    </div>

    <div class="row g-2 mb-3">
      <div class="col-6">
        <label class="form-label">Categoria *</label>
        <select v-model="form.category" class="form-select" required>
          <option value="" disabled>Selecione</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ capitalize(cat) }}</option>
        </select>
      </div>
      <div class="col-6">
        <label class="form-label">Condição *</label>
        <select v-model="form.condition" class="form-select" required>
          <option value="" disabled>Selecione</option>
          <option value="novo">Novo</option>
          <option value="seminovo">Seminovo</option>
          <option value="usado">Usado</option>
          <option value="desgastado">Desgastado</option>
        </select>
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">Troca por</label>
      <input
        v-model="form.trade_for"
        type="text"
        class="form-control"
        placeholder="Ex: Teclado, violão ou console"
        maxlength="255"
      />
    </div>

    <div class="mb-3">
      <label class="form-label">Fotos (máx. 5)</label>
      <input
        type="file"
        class="form-control"
        accept="image/jpeg,image/png,image/webp"
        multiple
        @change="onFilesChange"
      />
      <div class="photo-preview mt-2 d-flex gap-2 flex-wrap" v-if="previews.length">
        <div v-for="(src, i) in previews" :key="i" class="preview-thumb">
          <img :src="src" alt="Preview" />
          <button type="button" class="btn-remove" @click="removeFile(i)">×</button>
        </div>
      </div>
    </div>

    <button type="submit" class="btn btn-escambo w-100" :disabled="loading">
      <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
      {{ submitLabel }}
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  form: { type: Object, required: true },
  loading: { type: Boolean, default: false },
  submitLabel: { type: String, default: 'Publicar Item' },
});

const emit = defineEmits(['submit', 'update:files']);

// Categories must match backend VALID_CATEGORIES (all lowercase)
const categories = [
  'eletrônicos',
  'roupas',
  'livros',
  'móveis',
  'esportes',
  'jogos',
  'beleza',
  'casa',
  'animais',
  'jardim',
  'carro',
  'bicicleta',
  'música',
  'arte',
  'brinquedos',
  'outros'
];

const previews = ref([]);
const selectedFiles = ref([]);

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const onFilesChange = (e) => {
  const files = Array.from(e.target.files).slice(0, 5);
  selectedFiles.value = files;
  previews.value = files.map((f) => URL.createObjectURL(f));
  emit('update:files', files);
};

const removeFile = (index) => {
  previews.value.splice(index, 1);
  selectedFiles.value.splice(index, 1);
  emit('update:files', selectedFiles.value);
};
</script>

<style scoped lang="scss">
.item-form {
  .form-label {
    font-weight: 600;
    font-size: 0.9rem;
  }

  .preview-thumb {
    position: relative;
    width: 70px;
    height: 70px;
    border-radius: 8px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .btn-remove {
      position: absolute;
      top: 2px;
      right: 2px;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      border: none;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      font-size: 0.7rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }
}
</style>
