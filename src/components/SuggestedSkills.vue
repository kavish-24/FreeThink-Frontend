<template>
  <q-card class="my-card q-pa-md bg-blue-1 text-blue-8">
    <q-card-section class="q-pt-none text-center text-grey-9">
      <div class="main-title text-primary">Recommended Skills for Professional Development</div>
      <div class="category-text q-mb-md">
        Category: <span class="text-primary text-weight-medium">{{ category || 'Loading...' }}</span>
      </div>
    </q-card-section>


    <q-separator color="blue-3" />

    <q-card-section>
      <div v-if="loading" class="q-pa-md text-center">
        <q-spinner-dots color="primary" size="40px" />
      </div>

      <div v-else-if="suggestions.length === 0" class="text-grey-6 q-pa-md text-center">
        <q-icon name="lightbulb_outline" size="36px" color="grey-5" class="q-mb-sm" />
        <div>No skill suggestions available right now.</div>
      </div>

      <div v-else class="skills-wrapper">
        <q-chip
          v-for="(skill, index) in suggestions"
          :key="index"
          class="skill-chip"
          :color="skill.resource ? 'primary' : 'blue-4'"
          text-color="white"
          :icon="skill.resource ? 'stars' : 'label'"
          clickable
          @click="navigateToSkillDocs(skill)"
        >
          {{ skill.skill }}
          <q-tooltip class="bg-grey-8 text-white">
            {{ skill.resource ? 'Resource Available' : 'Click to see docs' }}
          </q-tooltip>
          <q-btn
            v-if="skill.resource"
            size="sm"
            flat
            round
            color="white"
            class="q-ml-xs"
            icon="play_arrow"
            :href="skill.resource"
            target="_blank"
            @click.stop
          >
            <q-tooltip class="bg-grey-8 text-white">Learn More</q-tooltip>
          </q-btn>
        </q-chip>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/auth.service";
import { authHelpers } from "src/services/auth.service";

const suggestions = ref([]);
const category = ref("");
const loading = ref(true);

const userId = authHelpers.getCurrentUser()?.id || "defaultUserId";

const fetchSuggestions = async () => {
  loading.value = true;
  try {
    const res = await api.get(`skills/${userId}`);
    if (res.data) {
      category.value = res.data.category || "General";
      suggestions.value = res.data.suggestions.map(s =>
        typeof s === "string" ? { skill: s, resource: null } : s
      );
    }
  } catch (err)
{
    console.error("Failed to fetch skill suggestions:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchSuggestions);

// NEW FUNCTION to handle navigation
const navigateToSkillDocs = (skill) => {
  const skillName = skill.skill.toLowerCase();

  const docUrls = {
    'javascript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    'typescript': 'https://www.typescriptlang.org/docs/',
    'python': 'https://docs.python.org/3/',
    'java': 'https://docs.oracle.com/en/java/',
    'c#': 'https://docs.microsoft.com/en-us/dotnet/csharp/',
    'react': 'https://react.dev/',
    'vue.js': 'https://vuejs.org/',
    'angular': 'https://angular.io/',
    'svelte': 'https://svelte.dev/',
    'node.js': 'https://nodejs.org/en/docs/',
    'express.js': 'https://expressjs.com/',
    'django': 'https://docs.djangoproject.com/en/stable/',
    'flask': 'https://flask.palletsprojects.com/',
    'css': 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    'html': 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    'sql': 'https://www.w3schools.com/sql/',
    'mongodb': 'https://www.mongodb.com/docs/',
    'docker': 'https://docs.docker.com/',
    'kubernetes': 'https://kubernetes.io/docs/home/',
    'git': 'https://git-scm.com/doc',
    'quasar': 'https://quasar.dev/'
  };

  const url = docUrls[skillName];

  if (url) {
    // If a specific URL is found, open it
    window.open(url, '_blank');
  } else {
    // Fallback: Perform a Google search for the skill's documentation
    const query = encodeURIComponent(`${skill.skill} official documentation`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  }
};
</script>

<style scoped>
/* MODIFIED: Added Google Font import */
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800&display=swap');

.my-card {
  /* MODIFIED: Applied the new font family */
  font-family: 'Nunito Sans', sans-serif;
  width: 100%;
  margin: 20px 0;
  border-radius: 0;
  box-shadow: none;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

/* NEW: Custom styles for the main title */
.main-title {
  font-weight: 800;
  font-size: 1.6rem;
  letter-spacing: -0.5px;
}

/* NEW: Custom styles for the category subtitle */
.category-text {
  font-size: 0.95rem;
  color: #5c6b77;
}

.skills-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.skill-chip {
  /* MODIFIED: Adjusted font style for the chips */
  font-size: 0.9rem;
  font-weight: 600;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.skill-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>