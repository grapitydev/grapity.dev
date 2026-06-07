<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface ReleaseInfo {
  name: string;
  version: string;
  url: string;
}

const versions = ref<ReleaseInfo[]>([]);
const loading = ref(true);
const error = ref(false);
const isOpen = ref(false);

const repos = [
  { name: "CLI", repo: "cli" },
  { name: "Registry", repo: "registry" },
  { name: "Hub", repo: "hub" },
];

async function fetchVersions() {
  try {
    const results = await Promise.all(
      repos.map(async ({ name, repo }) => {
        const response = await fetch(
          `https://api.github.com/repos/grapitydev/${repo}/releases/latest`,
        );
        if (!response.ok) throw new Error(`Failed to fetch ${repo}`);
        const data = await response.json();
        return {
          name,
          version: data.tag_name || "unknown",
          url:
            data.html_url || `https://github.com/grapitydev/${repo}/releases`,
        };
      }),
    );
    versions.value = results;
  } catch {
    error.value = true;
  } finally {
    loading.value = false;
  }
}

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function closeDropdown(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest(".version-dropdown")) {
    isOpen.value = false;
  }
}

onMounted(() => {
  fetchVersions();
  document.addEventListener("click", closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
});
</script>

<template>
  <div class="version-dropdown">
    <button
      class="version-trigger"
      @click.stop="toggleDropdown"
      :aria-expanded="isOpen"
    >
      <span v-if="loading" class="version-text">Loading...</span>
      <span v-else-if="error" class="version-text">Unavailable</span>
      <span v-else class="version-text">{{ versions[0]?.version }}</span>
      <span class="dropdown-arrow" :class="{ open: isOpen }">▼</span>
    </button>

    <div v-show="isOpen" class="version-menu">
      <div class="version-menu-header">Latest Releases</div>
      <a
        v-for="v in versions"
        :key="v.name"
        :href="v.url"
        target="_blank"
        rel="noopener noreferrer"
        class="version-item"
      >
        <span class="version-name">{{ v.name }}</span>
        <span class="version-tag">{{ v.version }}</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.version-dropdown {
  position: relative;
  margin-left: 12px;
  display: flex;
  align-items: center;
}

.version-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 16px;
  background: transparent;
  color: #8888a0;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--vp-font-family-base);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition:
    color 0.2s,
    border-color 0.2s;
}

.version-trigger:hover {
  color: #e4e4ed;
  border-color: rgba(255, 255, 255, 0.2);
}

.version-text {
  font-family: var(--vp-font-family-mono);
}

.dropdown-arrow {
  font-size: 8px;
  transition: transform 0.2s;
  opacity: 0.7;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.version-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  z-index: 100;
}

.version-menu-header {
  padding: 8px 16px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-2);
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 4px;
}

.version-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: background 0.2s;
}

.version-item:hover {
  background: var(--vp-c-bg-soft);
}

.version-name {
  font-size: 13px;
  font-weight: 500;
}

.version-tag {
  font-size: 12px;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  padding: 2px 8px;
  border-radius: 4px;
}
</style>
