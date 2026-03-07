<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered height-hint="98">
      <q-toolbar>
        <!-- <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" /> -->

        <q-toolbar-title>
          <div class="column">
            <div class="text-h6 text-weight-bold" style="line-height: 1.2rem;">
              tinatamad ako maningil
            </div>
            <div class="text-caption text-grey-4" v-if="auth.member">
              i need money, {{ auth.member.split(' ').at(0) }} :D
            </div>
          </div>
        </q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
        <div class="q-gutter-sm row items-center no-wrap">
          <div class="text-right q-mr-sm">
            <p class="q-mb-none text-caption text-weight-light">v{{ appVersion }}</p>
          </div>
          <q-btn flat round dense :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" @click="$q.dark.toggle()" />

          <q-btn flat round dense icon="logout" @click="confirmLogout">
            <q-tooltip>Logout</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
      <q-tabs align="left" dense active-color="positive" indicator-color="accent">
        <q-route-tab v-for="tab in tabs" :key="tab.to" v-bind="tab" />
      </q-tabs>
    </q-header>

    <!-- <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          Essential Links
        </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer> -->

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer bordered reveal>
      <q-toolbar class="justify-center text-caption">
        kara == gfriend == stayc > blackpink
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar, type QRouteTabProps } from 'quasar';
import { useAuthStore } from 'src/stores/auth-store';
// import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';
import { version } from 'root/package.json';

const appVersion = version;
const auth = useAuthStore();
const $q = useQuasar();

const tabs: QRouteTabProps[] = [
  { label: 'Stats', icon: 'query_stats', to: '/' },
  { label: 'Data', icon: 'storage', to: '/data' },
  { label: 'Pay', icon: 'payments', to: '/pay' }
];

const confirmLogout = () => {
  $q.dialog({
    title: 'Logout',
    message: 'Are you sure you want to log out?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    void auth.logout();
  });
  // void auth.logout();
};

// const linksList: EssentialLinkProps[] = [
//   {
//     title: 'Docs',
//     caption: 'quasar.dev',
//     icon: 'school',
//     link: 'https://quasar.dev',
//   },
//   {
//     title: 'Github',
//     caption: 'github.com/quasarframework',
//     icon: 'code',
//     link: 'https://github.com/quasarframework'
//   },
//   {
//     title: 'Discord Chat Channel',
//     caption: 'chat.quasar.dev',
//     icon: 'chat',
//     link: 'https://chat.quasar.dev'
//   },
//   {
//     title: 'Forum',
//     caption: 'forum.quasar.dev',
//     icon: 'record_voice_over',
//     link: 'https://forum.quasar.dev'
//   },
//   {
//     title: 'Twitter',
//     caption: '@quasarframework',
//     icon: 'rss_feed',
//     link: 'https://twitter.quasar.dev'
//   },
//   {
//     title: 'Facebook',
//     caption: '@QuasarFramework',
//     icon: 'public',
//     link: 'https://facebook.quasar.dev'
//   },
//   {
//     title: 'Quasar Awesome',
//     caption: 'Community Quasar projects',
//     icon: 'favorite',
//     link: 'https://awesome.quasar.dev'
//   }
// ];

// const leftDrawerOpen = ref(false);

// function toggleLeftDrawer() {
//   leftDrawerOpen.value = !leftDrawerOpen.value;
// }
</script>
