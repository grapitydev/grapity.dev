<script setup lang="ts">
function navigateHome() {
  // Force a full page load to bypass the VitePress SPA router.
  // Without this, the router intercepts "/" and resolves it as "/docs/"
  // (the docs root), which redirects back to quickstart.
  window.location.href = "/";
}
</script>

<template>
  <a href="/" @click.prevent="navigateHome" class="custom-nav-title">
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="custom-nav-logo">
      <defs>
        <linearGradient id="nav-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6366f1"/>
          <stop offset="100%" stop-color="#06b6d4"/>
        </linearGradient>
      </defs>
      <path d="M7 24 L16 6 L25 24 L21 24 L16 14 L11 24 Z" fill="url(#nav-logo-grad)"/>
      <circle cx="16" cy="24" r="2.5" fill="url(#nav-logo-grad)"/>
    </svg>
    <span class="custom-nav-text">grapity</span>
    <span class="custom-nav-text-secondary">Docs</span>
  </a>
</template>

<style scoped>
.custom-nav-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #e4e4ed;
  font-family: 'Space Grotesk', ui-sans-serif, system-ui, -apple-system, sans-serif;
  font-weight: 600;
  font-size: 1.125rem;
  letter-spacing: -0.025em;
  line-height: 1;
  padding-right: 1rem;
}

.custom-nav-logo {
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
}

.custom-nav-text {
  line-height: 1;
}

.custom-nav-text-secondary {
  line-height: 1;
  color: #8888a0;
  font-weight: 500;
}
</style>
