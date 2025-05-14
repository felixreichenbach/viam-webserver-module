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

  type Contour = {
    arclength: number;
    area: number;
    hausdorff?: { [key: string]: number };
  };

  type Extra = {
    ref_contours: Contour[];
    contours: Contour[];
  };

  let props: Props = $props();
  let extra = $derived(props.data?.extra?.toJson() as Extra | undefined);

  function checkContours(ref_contours: Contour[], contours: Contour[]) {
    let result = { length: "", area: "", shape: "" };
    if (ref_contours && ref_contours.length == contours.length) {
      for (const [rci, refcont] of ref_contours.entries()) {
        for (const [ci, contour] of contours.entries()) {
          console.log(
            "diff length",
            ci,
            Math.abs(refcont.arclength - contour.arclength)
          );
          if (Math.abs(refcont.arclength - contour.arclength) < 100) {
            result["length"] = "good";
          }
          console.log("diff area", Math.abs(refcont.area - contour.area));
          if (Math.abs(refcont.area - contour.area) < 100) {
            result["area"] = "good";
          }
          if (contour.hausdorff) {
            console.log("hausdorff", typeof contour.hausdorff);
            const keys = Object.keys(contour.hausdorff);
            keys.forEach((key) => {
              const hausdorffValue = contour.hausdorff
                ? contour.hausdorff[key]
                : undefined;
              console.log("diff hausdorff", hausdorffValue);
              if (hausdorffValue !== undefined && hausdorffValue < 100) {
                result["shape"] = "good";
              }
            });
          }
          if (result["shape"] === "") {
            result["shape"] = "bad";
          }
        }
        if (result["length"] === "") {
          result["length"] = "bad";
        }
        if (result["area"] === "") {
          result["area"] = "bad";
        }
      }
    }
    return result;
  }

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
