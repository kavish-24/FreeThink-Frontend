<template>
  <q-layout view="hHh Lpr lFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
          JobHub Admin
        </q-toolbar-title>
        <q-space />
        <div class="q-mr-md text-body2">Welcome, Admin!</div>
        <q-btn flat round dense icon="logout" @click="handleLogout" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="250"
    >
      <q-list>
        <q-item-label header class="text-grey-8 q-pt-md">
          Admin Navigation
        </q-item-label>

        <q-item clickable v-ripple to="/admin/dashboard" exact active-class="admin-active-link">
          <q-item-section avatar> <q-icon name="dashboard" /> </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin/companies" active-class="admin-active-link">
          <q-item-section avatar> <q-icon name="business" /> </q-item-section>
          <q-item-section>Companies</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin/users" active-class="admin-active-link">
          <q-item-section avatar> <q-icon name="manage_accounts" /> </q-item-section>
          <q-item-section>User Management</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin/queries" active-class="admin-active-link">
          <q-item-section avatar> <q-icon name="whatsapp" /> </q-item-section>
          <q-item-section>Chats & Queries</q-item-section>
        </q-item>
        
        <q-separator class="q-my-md" />

        <q-item clickable v-ripple @click="handleLogout">
          <q-item-section avatar> <q-icon name="logout" /> </q-item-section>
          <q-item-section>Logout</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import adminService from 'src/services/admin.service';

const leftDrawerOpen = ref(false);
const router = useRouter();

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const handleLogout = () => {
  adminService.logout();
  router.push('/admin/login');
};
</script>

<style scoped>
.admin-active-link {
  background-color: #e3f2fd;
  color: #1976d2;
  font-weight: 500;
}
</style>