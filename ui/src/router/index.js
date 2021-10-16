import { createRouter, createWebHistory } from "vue-router";

import Dashboard from "@/views/Dashboard.vue";

const routes = [
  {
    path: "/",
    name: "dashboard",
    component: Dashboard,
    meta: {
      topLevel: true,
      index: 0,
    },
  },
  {
    path: "/sockets/",
    name: "sockets",
    component: () => import("@/views/Sockets.vue"),
    meta: {
      topLevel: true,
      index: 1,
    },
  },
  {
    path: "/n/:nsp/sockets/:id",
    name: "socket",
    component: () => import("@/views/Socket.vue"),
    meta: {
      topLevel: false,
    },
  },
  {
    path: "/rooms/",
    name: "rooms",
    component: () => import("@/views/Rooms.vue"),
    meta: {
      topLevel: true,
      index: 2,
    },
  },
  {
    path: "/n/:nsp/rooms/:name",
    name: "room",
    component: () => import("@/views/Room.vue"),
    meta: {
      topLevel: false,
    },
  },
  {
    path: "/clients/",
    name: "clients",
    component: () => import("@/views/Clients.vue"),
    meta: {
      topLevel: true,
      index: 3,
    },
  },
  {
    path: "/clients/:id",
    name: "client",
    component: () => import("@/views/Client.vue"),
    meta: {
      topLevel: false,
    },
  },
  {
    path: "/servers/",
    name: "servers",
    component: () => import("@/views/Servers.vue"),
    meta: {
      topLevel: true,
      index: 4,
    },
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: () => import("@/views/NotFound.vue"), },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || process.env.BASE_URL),
  routes,
});

export default router;
