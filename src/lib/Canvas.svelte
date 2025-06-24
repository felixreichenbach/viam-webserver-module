<script lang="ts">
  import type { Detection } from "@viamrobotics/sdk";

  interface Props {
    src?: string;
    width?: number;
    height?: number;
    detections?: Detection[];
  }

  let { src, width = 700, height = 720, detections }: Props = $props();

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
      //ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

      // Draw with proper scaling
      const scale = Math.min(
        canvasEl.width / img.width,
        canvasEl.height / img.height
      );

      const x = (canvasEl.width - img.width * scale) / 2;
      const y = (canvasEl.height - img.height * scale) / 2;

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      drawBoundingBoxes(scale, x, y);
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

  // Function to draw all bounding boxes onto the canvas
  function drawBoundingBoxes(scale: number, offsetX: number, offsetY: number) {
    if (!ctx || !canvasEl || !detections) return;
    // Iterate over each box in our list and draw it
    detections.forEach((detection) => {
      if (!ctx) return;
      // Set the stroke style (color and line width)
      ctx.strokeStyle = "red"; // Use box's color or default to black
      ctx.lineWidth = 2; // Line thickness

      // Draw the rectangle outline
      const xMin =
        typeof detection.xMin === "bigint"
          ? Number(detection.xMin)
          : detection.xMin;
      const yMin =
        typeof detection.yMin === "bigint"
          ? Number(detection.yMin)
          : detection.yMin;
      const xMax =
        typeof detection.xMax === "bigint"
          ? Number(detection.xMax)
          : detection.xMax;
      const yMax =
        typeof detection.yMax === "bigint"
          ? Number(detection.yMax)
          : detection.yMax;
      if (
        typeof xMin === "number" &&
        typeof yMin === "number" &&
        typeof xMax === "number" &&
        typeof yMax === "number"
      ) {
        // Scale coordinates to match the drawn image
        const scaledX = xMin * scale + offsetX;
        const scaledY = yMin * scale + offsetY;
        const scaledWidth = (xMax - xMin) * scale;
        const scaledHeight = (yMax - yMin) * scale;
        ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
      }

      // Optional: Add a semi-transparent fill for better visibility/highlighting
      // ctx.fillStyle = `rgba(${parseInt(box.color.slice(1,3), 16)}, ${parseInt(box.color.slice(3,5), 16)}, ${parseInt(box.color.slice(5,7), 16)}, 0.2)`;
      // ctx.fillRect(box.x, box.y, box.width, box.height);
    });
  }
</script>

<canvas
  bind:this={canvasEl}
  {width}
  {height}
  class="max-h-[720px] object-contain"
></canvas>
