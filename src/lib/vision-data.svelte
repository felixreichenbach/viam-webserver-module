<script lang="ts">
  import {
    Detection,
    type Classification,
    type PointCloudObject,
    type Struct,
  } from "@viamrobotics/sdk";

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

  let props: Props = $props();
  let { detections, extra } = $derived(
    props.data ?? { detections: [], extra: undefined }
  );
  $effect(() => {
    console.log("detections", detections);
    console.log("extra", extra);
  });

  let resultContours = $state("good");
  let resultArcLength = $state("bad");
  let resultArea = $state("");
</script>

<div>
  <div id="arclength" class="result {resultArcLength} mb-4">
    <span class="text-3xl font-bold">Arc Length</span>
  </div>
  <div id="area" class="result {resultArea} mb-4">
    <span class="text-3xl flex justify-center items-center font-bold">Area</span
    >
  </div>
  <div id="contours" class="result {resultContours}">
    <span class="text-3xl font-bold">Contours</span>
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
