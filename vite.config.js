import { defineConfig } from 'vite';

// Source lives in /site, the deployable build lands in /public (served by the Worker).
// /public is committed so Cloudflare can deploy without a build step.
export default defineConfig({
  root: 'site',
  publicDir: 'static',
  build: {
    outDir: '../public',
    emptyOutDir: false,
    assetsDir: 'build',
    target: 'es2020',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) { if (id.includes('node_modules/three')) return 'three'; if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) return 'motion'; }
      }
    }
  }
});
