<template>
  <q-card class="my-card q-pa-md">
    <q-card-section>
      <div class="text-h6">Recommended Skills for You</div>
      <div class="text-subtitle2 text-grey">
        Category: {{ category || "Loading..." }}
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div v-if="loading" class="q-pa-md text-center">
        <q-spinner-dots color="primary" size="40px" />
      </div>

      <div v-else-if="suggestions.length === 0" class="text-grey q-pa-md">
        No skill suggestions available
      </div>

      <div class="skills-wrapper">
        <q-chip
          v-for="(skill, index) in suggestions"
          :key="index"
          class="q-mb-sm q-mr-sm"
          color="primary"
          text-color="white"
          outline
        >
          {{ skill.skill }}
          <q-btn
            v-if="skill.resource"
            size="xs"
            flat
            round
            color="white"
            class="q-ml-xs"
            icon="play_arrow"
            :href="skill.resource"
            target="_blank"
          />
        </q-chip>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { authHelpers } from "src/services/auth.service";

const suggestions = ref([]);
const category = ref("");
const loading = ref(true);

// Replace with the actual logged-in user ID from auth store
const userId = authHelpers.getCurrentUser()?.id || "defaultUserId";

const fetchSuggestions = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`http://localhost:3000/api/skills/${userId}`);
    if (res.data) {
      category.value = res.data.category || "General";
      suggestions.value = res.data.suggestions.map(s =>
        typeof s === "string" ? { skill: s, resource: null } : s
      );
    }
  } catch (err) {
    console.error("Failed to fetch skill suggestions:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchSuggestions);
</script>

<style scoped>
.my-card {
  width: 100%; /* Full width */
  margin: 20px 0; /* Small top/bottom spacing */
  border-radius: 0; /* Optional: remove rounded corners for full-width */
  background: #f9fafd;
  box-shadow: none; /* Optional: remove shadow if you want edge-to-edge flat look */
}

.skills-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 12px; /* spacing between chips */
}
</style>
