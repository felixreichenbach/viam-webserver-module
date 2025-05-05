<script lang="ts">
  import { createResourceClient, createResourceQuery } from "$lib";
  import VisionControl from "$lib/vision-control.svelte";
  import VisionData from "$lib/vision-data.svelte";
  import { VisionClient } from "@viamrobotics/sdk";

  interface Props {
    partID: string;
    name: string;
    cameraName: string;
  }

  let { partID, name: name, cameraName }: Props = $props();

  const visionClient = createResourceClient(
    VisionClient,
    () => partID,
    () => name,
  );

  const queryOptions = $state({
    refetchInterval: 1000,
    enabled: false,
  });

  const query = createResourceQuery(
    visionClient, // client
    "captureAllFromCamera", // method
    [
      cameraName,
      {
        returnImage: true,
        returnClassifications: false,
        returnDetections: true,
        returnObjectPointClouds: false,
      },
    ], // CaptureAllOptions
    () => queryOptions, // options
  );

  const src = $derived(
    query.current.data
      ? URL.createObjectURL(
          new Blob([query.current.data.image!.image], { type: "image/png" }),
        )
      : undefined,
  );

  const extra = $derived(
    query.current.data ? JSON.stringify(query.current.data.extra, null, 2) : "",
  );

  function handleCheckContour() {
    query.current.refetch().then(() => {
      console.log("contour refreshed");
    });
  }

  function handleAccept() {
    console.log("Button Accept: To be implemented");
  }
</script>

{#if query.current.error}
  {query.current.error.message}
{:else}
  {console.log("refreshed")}
  <div class="flex flex-row gap-20 m-4">
    <div class="basis-400"><img {src} alt="" width="700" /></div>
    <div class="basis-1/3">
      <div class="flex flex-col items-center justify-center gap-4 h-full">
        <VisionControl {handleCheckContour} {handleAccept}></VisionControl>
        <VisionData data={extra} />
      </div>
    </div>
  </div>
{/if}
