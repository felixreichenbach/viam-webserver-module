<script lang="ts">
  import type { Struct } from "@viamrobotics/sdk";

  interface Contour {
    arclength?: number;
    area?: number;
    hausdorff?: any;
  }

  let { data }: { data: Struct } = $props();

  let contours = $derived(
    data.fields.contours
      ? (data.fields.contours.toJson() as Array<Contour>)
      : []
  );
</script>

{#if Array.isArray(contours)}
  <ul>
    {#each contours as contour, index}
      <li>
        <strong>Contour {index + 1}:</strong>
        <ul style="list-style-type: disc; padding-left: 20px;">
          <li>Arclength: {contour?.arclength}</li>
          <li>Area: {contour?.area}</li>
          <li>Hausdorff: {JSON.stringify(contour.hausdorff)}</li>
        </ul>
      </li>
    {/each}
  </ul>
{/if}
