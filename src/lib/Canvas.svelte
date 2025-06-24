<!-- Canvas.svelte -->
<script lang="ts">
  interface Props {
    src?: string;
    width?: number;
    height?: number;
    detections?: any[];
  }

  let { src, width = 700, height = 720 }: Props = $props();

  let canvasEl = $state<HTMLCanvasElement | undefined>(undefined);
  let ctx = $state<CanvasRenderingContext2D | undefined>(undefined);

  $effect(() => {
    if (canvasEl) {
      ctx = canvasEl.getContext("2d") ?? undefined;
    }
  });

  $effect(() => {
    if (src && ctx && canvasEl) {
      drawImage(src);
    }
  });

  async function drawImage(imageSrc: string) {
    if (!ctx || !canvasEl) return;

    try {
      const img = await loadImage(imageSrc);
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

      // Draw with proper scaling
      const scale = Math.min(
        canvasEl.width / img.width,
        canvasEl.height / img.height
      );

      const x = (canvasEl.width - img.width * scale) / 2;
      const y = (canvasEl.height - img.height * scale) / 2;

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    } catch (error) {
      console.error("Error drawing image:", error);
    }
  }

  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }
</script>

<canvas
  bind:this={canvasEl}
  {width}
  {height}
  class="max-h-[720px] object-contain border"
></canvas>
