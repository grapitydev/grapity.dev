<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";

type Classification = "major" | "minor" | "patch";

interface ReleaseInfo {
  name: string;
  version: string;
  url: string;
  classification: Classification;
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

function parseSemver(tag: string): { major: number; minor: number; patch: number } {
  const clean = tag.replace(/^v/, "");
  const [major, minor, patch] = clean.split(".").map((n) => parseInt(n, 10));
  return { major: major || 0, minor: minor || 0, patch: patch || 0 };
}

function classifyVersion(tag: string): Classification {
  const { minor, patch } = parseSemver(tag);
  if (minor === 0 && patch === 0) return "major";
  if (patch === 0) return "minor";
  return "patch";
}

async function fetchVersions() {
  try {
    const results = await Promise.all(
      repos.map(async ({ name, repo }) => {
        const response = await fetch(
          `https://api.github.com/repos/grapitydev/${repo}/releases/latest`,
        );
        if (!response.ok) throw new Error(`Failed to fetch ${repo}`);
        const data = await response.json();
        const version = data.tag_name || "unknown";
        return {
          name,
          version,
          url:
            data.html_url || `https://github.com/grapitydev/${repo}/releases`,
          classification: classifyVersion(version),
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

const primaryVersion = computed(() => versions.value[0]);

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
      :class="primaryVersion?.classification"
      @click.stop="toggleDropdown"
      :aria-expanded="isOpen"
    >
      <span v-if="loading" class="version-text">Loading...</span>
      <span v-else-if="error" class="version-text">Unavailable</span>
      <span v-else class="version-text">{{ primaryVersion?.version }}</span>
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
        <span class="version-tag" :class="v.classification">
          {{ v.version }}
        </span>
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
  border-color: rgba(255, 255, 255, 0.2);
}

/* Trigger colors by classification */
.version-trigger.major {
  color: #6366f1;
  border-color: rgba(99, 102, 241, 0.3);
}
.version-trigger.major:hover {
  border-color: rgba(99, 102, 241, 0.5);
}

.version-trigger.minor {
  color: #3b82f6;
  border-color: rgba(59, 130, 246, 0.3);
}
.version-trigger.minor:hover {
  border-color: rgba(59, 130, 246, 0.5);
}

.version-trigger.patch {
  color: #06b6d4;
  border-color: rgba(6, 182, 212, 0.3);
}
.version-trigger.patch:hover {
  border-color: rgba(6, 182, 212, 0.5);
}

/* Light mode trigger colors */
:global(.light) .version-trigger.major {
  color: #6366f1;
  border-color: rgba(99, 102, 241, 0.3);
}
:global(.light) .version-trigger.major:hover {
  border-color: rgba(99, 102, 241, 0.5);
}

:global(.light) .version-trigger.minor {
  color: #2563eb;
  border-color: rgba(37, 99, 235, 0.3);
}
:global(.light) .version-trigger.minor:hover {
  border-color: rgba(37, 99, 235, 0.5);
}

:global(.light) .version-trigger.patch {
  color: #06b6d4;
  border-color: rgba(6, 182, 212, 0.3);
}
:global(.light) .version-trigger.patch:hover {
  border-color: rgba(6, 182, 212, 0.5);
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
  padding: 2px 8px;
  border-radius: 4px;
}

/* Tag colors by classification - dark mode */
.version-tag.major {
  color: #6366f1;
  background: rgba(99, 102, 241, 0.15);
}
.version-tag.minor {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.15);
}
.version-tag.patch {
  color: #06b6d4;
  background: rgba(6, 182, 212, 0.15);
}

/* Tag colors by classification - light mode */
:global(.light) .version-tag.major {
  color: #6366f1;
  background: rgba(99, 102, 241, 0.1);
}
:global(.light) .version-tag.minor {
  color: #2563eb;
  background: rgba(37, 99, 235, 0.1);
}
:global(.light) .version-tag.patch {
  color: #06b6d4;
  background: rgba(6, 182, 212, 0.1);
}
</style>
