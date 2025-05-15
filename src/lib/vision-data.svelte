<script lang="ts">
  import {
    Detection,
    type Classification,
    type PointCloudObject,
    type Struct,
  } from "@viamrobotics/sdk";
  import { checkContours, type Contour } from "$lib/contours";

  interface Props {
    data:
      | {
          image: any;
          classifications: Classification[];
          detections: Detection[];
          objectPointClouds: PointCloudObject[];
          extra: Struct | undefined;
        }
      | undefined;
  }

  type Extra = {
    ref_contours: Contour[];
    contours: Contour[];
  };

  let props: Props = $props();
  let extra = $derived(props.data?.extra?.toJson() as Extra | undefined);

  let result = $derived(
    checkContours(extra?.ref_contours ?? [], extra?.contours ?? [])
  );
</script>

<div>
  <div id="arclength" class="result {result['length']} mb-4">
    <span class="text-3xl font-bold">Length</span>
  </div>
  <div id="area" class="result {result['area']} mb-4">
    <span class="text-3xl flex justify-center items-center font-bold">Area</span
    >
  </div>
  <div id="contours" class="result {result['shape']}">
    <span class="text-3xl font-bold">Shape</span>
  </div>
</div>

<style lang="postcss">
  @reference "tailwindcss";
  .result {
    background-color: rgb(255, 255, 255);
    @apply w-60 h-25 border-1 flex justify-center items-center rounded;
  }
  .result.bad {
    background-color: rgb(255, 0, 0);
  }
  .result.good {
    background-color: rgb(0, 255, 0);
  }
</style>
