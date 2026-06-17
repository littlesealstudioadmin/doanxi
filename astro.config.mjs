// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 배포 도메인 구매 후 이 값만 바꾸면 됩니다 (SEO/사이트맵/OG 절대경로에 사용)
const SITE_URL = process.env.SITE_URL || 'https://doanxi-centumriche.example.com';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap()],
  image: {
    // 정적 빌드 시 sharp로 WebP/AVIF 자동 변환·리사이즈 (공식사이트 1.5MB 무압축 이미지 문제 해결)
    responsiveStyles: true,
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
