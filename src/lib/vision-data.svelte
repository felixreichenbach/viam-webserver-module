<script lang="ts">
  interface Props {
    data: any;
  }

  let { data }: Props = $props();

  let resultContours = $state("good");
  let resultArcLength = $state("bad");
  let resultArea = $state("");

  function changeAreaColor(color: string) {
    if (resultArea === "bad") {
      resultArea = "good";
    } else {
      resultArea = "bad";
    }
  }
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
    @apply w-60 h-25 border-2 flex justify-center items-center rounded;
  }
  .result.bad {
    background-color: rgb(255, 0, 0);
  }
  .result.good {
    background-color: rgb(0, 255, 0);
  }
</style>
