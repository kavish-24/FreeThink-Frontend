<template>
  <div class="legal-page">
    <AppHeader />

    <main class="content-container q-pa-md">
      <div v-if="loading" class="text-center q-py-xl">
        <q-spinner-dots color="primary" size="40px" />
        <p class="q-mt-md text-grey-7">Loading Terms...</p>
      </div>

      <div v-else-if="error" class="text-center q-py-xl">
         <q-icon name="error_outline" color="negative" size="40px" />
         <p class="q-mt-md text-negative">Failed to load the terms and conditions. Please try again later.</p>
      </div>

      <div v-else-if="termsData">
        <div class="text-center q-mb-xl">
          <h1 class="page-title">{{ termsData.title }}</h1>
          <p class="text-grey-7">Last Updated: {{ termsData.lastUpdated }}</p>
        </div>

        <div class="legal-content">
          <p class="intro">
            {{ termsData.intro }}
          </p>

          <section v-for="(section, index) in termsData.sections" :key="index">
            <h3>{{ section.heading }}</h3>
            <div v-html="section.content"></div>
          </section>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppHeader from '../components/HeaderPart.vue';
import AppFooter from '../components/FooterPart.vue';

const termsData = ref(null);
const loading = ref(true);
const error = ref(false);

// This function runs when the component is first mounted
onMounted(async () => {
  try {
    // Fetch the content from the JSON file located in the public folder
    const response = await fetch('/content/terms.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    termsData.value = await response.json();
  } catch (e) {
    console.error('Failed to fetch terms:', e);
    error.value = true;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* Reusing a generic class name for consistency with other legal pages */
.legal-page {
  background-color: #f9fbfd;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  color: #333;
}

.content-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 20px;
}

.page-title {
  font-size: 40px;
  font-weight: 700;
  color: #1565c0;
}

.legal-content {
  background-color: #ffffff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  line-height: 1.7;
}

.legal-content section {
  margin-bottom: 30px;
}

.legal-content h3 {
  font-size: 22px;
  font-weight: 600;
  color: #1d2b53;
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eaecef;
}

/* These styles will now apply to the content rendered by v-html */
:deep(.legal-content p), :deep(.legal-content li) {
  font-size: 16px;
  color: #555;
  margin-bottom: 10px;
}

:deep(.legal-content ul) {
  padding-left: 20px;
}

:deep(.legal-content a) {
  color: #1565c0;
  text-decoration: none;
  font-weight: 600;
}

:deep(.legal-content a:hover) {
  text-decoration: underline;
}

.intro {
  font-size: 1.1rem;
  font-style: italic;
  color: #444;
  margin-bottom: 30px;
}
</style>