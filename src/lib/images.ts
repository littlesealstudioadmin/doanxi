import type { ImageMetadata } from 'astro';

/**
 * src/assets/images 하위 이미지를 파일명으로 가져오는 헬퍼.
 * 새 이미지를 교체할 때는 같은 경로에 같은 파일명으로 넣으면 됩니다.
 * (Astro가 빌드 시 WebP/AVIF 변환 + 반응형 리사이즈를 자동 처리)
 */
const images = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

export function img(path: string): ImageMetadata {
  const key = `../assets/images/${path}`;
  const found = images[key];
  if (!found) {
    throw new Error(
      `[images] 이미지를 찾을 수 없습니다: ${path}\n` +
        `사용 가능: ${Object.keys(images).map((k) => k.replace('../assets/images/', '')).join(', ')}`,
    );
  }
  return found.default;
}
