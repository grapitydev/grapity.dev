<script setup lang="ts">
import { ref, onMounted } from "vue";

interface ReleaseInfo {
  version: string;
  url: string;
}

const release = ref<ReleaseInfo | null>(null);
const loading = ref(true);
const error = ref(false);

async function fetchVersion() {
  try {
    const response = await fetch(
      "https://api.github.com/repos/grapitydev/grapity/releases/latest",
    );
    if (!response.ok) throw new Error("Failed to fetch");
    const data = await response.json();
    release.value = {
      version: data.tag_name || "unknown",
      url: data.html_url || "https://github.com/grapitydev/grapity/releases",
    };
  } catch {
    error.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchVersion();
});
</script>

<template>
  <a
    v-if="release && !error"
    :href="release.url"
    target="_blank"
    rel="noopener noreferrer"
    class="version-badge"
  >
    <span class="version-text">{{ release.version }}</span>
  </a>
  <span v-else-if="error" class="version-badge unavailable">
    Unavailable
  </span>
  <span v-else class="version-badge loading">
    <span class="version-spinner"></span>
  </span>
</template>

<style scoped>
.version-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--vp-font-family-mono);
  color: #06b6d4;
  border: 1px solid rgba(6, 182, 212, 0.3);
  text-decoration: none;
  transition: border-color 0.2s;
  margin-left: 12px;
}

.version-badge:hover {
  border-color: rgba(6, 182, 212, 0.5);
}

.version-badge.unavailable {
  color: #8888a0;
  border-color: rgba(255, 255, 255, 0.1);
  cursor: default;
}

.version-badge.loading {
  border-color: rgba(255, 255, 255, 0.1);
  cursor: default;
}

.version-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: #8888a0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Light mode */
:global(.light) .version-badge {
  color: #06b6d4;
  border-color: rgba(6, 182, 212, 0.3);
}
:global(.light) .version-badge:hover {
  border-color: rgba(6, 182, 212, 0.5);
}
:global(.light) .version-badge.unavailable {
  color: #8888a0;
  border-color: rgba(0, 0, 0, 0.1);
}
:global(.light) .version-spinner {
  border-color: rgba(0, 0, 0, 0.1);
  border-top-color: #8888a0;
}
</style>
