<template>
  <div class="about-us-page">
    <header class="navbar">
      <div class="logo">💼 JobHub</div>
      <nav class="nav-links">
        <router-link to="/" exact-active-class="active-link">Home</router-link>
        <router-link to="/employers" exact-active-class="active-link">Employers</router-link>
      </nav>
    </header>

    <div v-if="isLoading" class="flex flex-center" style="height: 80vh;">
      <q-spinner-cube color="primary" size="5.5em" />
    </div>
    <div v-else-if="error" class="flex flex-center" style="height: 80vh;">
       <q-banner rounded class="bg-negative text-white">
        <template v-slot:avatar><q-icon name="warning" /></template>
        {{ error }}
       </q-banner>
    </div>

    <div v-else-if="pageData">
      <section class="about-hero">
        <div class="hero-content">
          <h1>About <span class="brand-name">JobHub</span></h1>
          <p class="subtitle">We're on a mission to bridge the gap between exceptional talent and outstanding opportunities, making hiring a simple, fast, and human experience.</p>
        </div>
      </section>

      <section class="our-story glass-section">
        <h2>{{ pageData.story.title }}</h2>
        <div class="story-content" v-html="pageData.story.content"></div>
      </section>

      <section class="mission-vision glass-section">
        <div class="mission-vision-grid">
          <div class="mission-card">
            <div class="card-icon">🎯</div>
            <h3>{{ pageData.mission.title }}</h3>
            <div v-html="pageData.mission.content"></div>
          </div>
          <div class="mission-card">
            <div class="card-icon">🔭</div>
            <h3>{{ pageData.vision.title }}</h3>
            <div v-html="pageData.vision.content"></div>
          </div>
        </div>
      </section>

      <section class="features-section glass-section">
          <h2>{{ pageData.features.title }}</h2>
          <p>{{ pageData.features.subtitle }}</p>
          <div class="features-grid">
              <div class="feature-card" v-for="feature in pageData.features.items" :key="feature.title">
                  <div class="feature-icon">{{ feature.icon }}</div>
                  <h4>{{ feature.title }}</h4>
                  <div v-html="feature.text"></div>
              </div>
          </div>
      </section>

      <section class="audience-section glass-section">
        <h2>{{ pageData.audiences.title }}</h2>
        <div class="audience-grid">
          <div class="audience-card" v-for="audience in pageData.audiences.items" :key="audience.title">
            <h3>{{ audience.title }}</h3>
            <div v-html="audience.text"></div>
          </div>
        </div>
      </section>

      <section class="meet-the-team glass-section">
        <h2>{{ pageData.team.title }}</h2>
        <p>{{ pageData.team.subtitle }}</p>
        <div class="team-grid">
          <div class="team-card" v-for="member in pageData.team.members" :key="member.name">
            <img :src="member.img" :alt="member.name" class="team-photo">
            <h4>{{ member.name }}</h4>
            <p class="title">{{ member.title }}</p>
          </div>
        </div>
      </section>

      <section class="testimonials glass-section">
          <h2>{{ pageData.testimonials.title }}</h2>
          <p>{{ pageData.testimonials.subtitle }}</p>
          <div class="testimonial-card" v-for="testimonial in pageData.testimonials.items" :key="testimonial.name">
              <img :src="testimonial.img" :alt="testimonial.name" class="client-photo">
              <p class="quote">"{{ testimonial.quote }}"</p>
              <p class="author"><strong>{{ testimonial.name }}</strong>, {{ testimonial.title }}</p>
          </div>
      </section>

      <section class="final-cta glass-section">
        <h2>Ready to Get Started?</h2>
        <p>Your next career move or star employee is just a click away.</p>
        <div class="cta-buttons">
          <button class="btn primary" @click="goToJobs">Explore Jobs</button>
          <button class="btn outline" @click="goToPostJob">Post a Job</button>
        </div>
      </section>
      <AppFooter />
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { marked } from 'marked';
import AppFooter from '../components/FooterPart.vue'; // Adjust path if needed

const router = useRouter();

const pageData = ref(null);
const isLoading = ref(true);
const error = ref(null);

onMounted(() => {
  fetchAboutContent();
});

const fetchAboutContent = async () => {
  try {
    // 1. Fetch the JSON file from the public folder
    const response = await axios.get('/content/about-us.json');
    const data = response.data;

    // 2. Convert markdown fields to HTML
    data.story.content = marked.parse(data.story.content);
    data.mission.content = marked.parse(data.mission.content);
    data.vision.content = marked.parse(data.vision.content);
    data.features.items.forEach(item => {
      item.text = marked.parse(item.text);
    });
    data.audiences.items.forEach(item => {
      item.text = marked.parse(item.text);
    });

    // 3. Set the final data
    pageData.value = data;

  } catch (err) {
    console.error("Failed to fetch About Us content:", err);
    error.value = "Could not load page content. Please try again later.";
  } finally {
    isLoading.value = false;
  }
};

const goToJobs = () => {
  router.push('/');
};
const goToPostJob = () => {
  router.push('/employers');
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Satisfy&display=swap');

/* Basic Page & Background Setup */
@keyframes animatedGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 60px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo{font-weight:700;color:#2d6cff;font-size:24px}.nav-links a{margin:0 20px;color:#333;font-weight:500;text-decoration:none;transition:color .2s}.nav-links a:hover,.nav-links .active-link{color:#2d6cff}

.about-us-page {
  font-family: 'Inter', sans-serif;
  color: #2a2a2a;
  background: linear-gradient(-45deg, #d1e3ff, #f0f8ff, #e0f0ff, #f3eaff);
  background-size: 400% 400%;
  animation: animatedGradient 20s ease infinite;
  padding-bottom: 60px;
}

/* Hero Section */
.about-hero {
  padding: 100px 60px;
  text-align: center;
  color: #2a2a2a;
}
.about-hero h1 {
  font-size: 56px;
  font-weight: 700;
  margin-bottom: 20px;
  animation: fadeInDown .8s ease-out;
}
.brand-name {
  font-family: 'Satisfy', cursive;
  color: #2d6cff;
}
.about-hero .subtitle {
  font-size: 20px;
  max-width: 750px;
  margin: 0 auto;
  color: #333;
  line-height: 1.6;
  animation: fadeInUp .8s ease-out .2s;
  animation-fill-mode: backwards;
}

/* Glass Section Base Style */
.glass-section {
  margin: 40px 60px;
  border-radius: 24px;
  padding: 60px;
  text-align: center;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
}
.glass-section h2 {
  font-size: 32px;
  margin-bottom: 15px;
}
.glass-section > p {
  color: #555;
  margin-bottom: 50px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
}

/* Story section needs deep selectors for v-html */
.story-content {
  color: #555;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
}
.story-content :deep(p) { margin: 0; }


/* NEW Section Styles */
.mission-vision-grid, .features-grid, .audience-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  text-align: left;
}
.mission-vision-grid { grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); }

.mission-card, .feature-card, .audience-card {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.7);
  padding: 30px;
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.mission-card:hover, .feature-card:hover, .audience-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 25px rgba(45, 108, 255, 0.1);
}
.card-icon, .feature-icon {
  font-size: 36px;
  margin-bottom: 15px;
}
.mission-card h3, .feature-card h4, .audience-card h3 {
  font-size: 20px;
  color: #2d6cff;
  margin-bottom: 10px;
}
.mission-card p, .feature-card p, .audience-card p {
  color: #555;
  line-height: 1.6;
  margin: 0;
}
.audience-card { text-align: center; }

/* Styles for v-html content */
.mission-card :deep(p), .feature-card :deep(p), .audience-card :deep(p) {
    color: #555;
    line-height: 1.6;
    margin: 0;
}


/* Team Section */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 40px;
}
.team-card {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  padding: 25px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.team-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.1);
}
.team-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  object-fit: cover;
}
.team-card h4 {
  font-size: 18px;
  margin-bottom: 5px;
  color: #333;
}
.team-card .title {
  font-size: 15px;
  color: #2d6cff;
  font-weight: 500;
  margin: 0;
}

/* Testimonials Section */
.testimonial-card {
  max-width: 700px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.7);
  padding: 30px;
  border-radius: 16px;
}
.client-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid #fff;
  margin-bottom: 20px;
}
.quote {
  font-size: 18px;
  font-style: italic;
  color: #555;
  margin-bottom: 15px !important;
}
.author {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 !important;
}

/* Final CTA Section */
.final-cta p {
  margin-bottom: 30px;
}
.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}
.btn {
  padding: 14px 28px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
}
.btn.primary {
  background: #2d6cff;
  color: #fff;
}
.btn.primary:hover {
  background: #1c4fcf;
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(45, 108, 255, 0.25);
}
.btn.outline {
  background: transparent;
  color: #2d6cff;
  border: 2px solid #2d6cff;
}
.btn.outline:hover {
  background: rgba(45, 108, 255, 0.1);
}

/* Animations */
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>