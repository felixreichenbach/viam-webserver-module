<script lang="ts">
  import { createResourceClient, createResourceQuery } from "$lib";
  import { Struct, VisionClient } from "@viamrobotics/sdk";
  import Metrics from "./metrics.svelte";

  interface Props {
    partID: string;
    name: string;
    cameraName: string;
  }

  let { partID, name: name, cameraName }: Props = $props();

  const visionClient = createResourceClient(
    VisionClient,
    () => partID,
    () => name
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
    () => queryOptions // options
  );

  const src = $derived(
    query.current.data
      ? URL.createObjectURL(
          new Blob([query.current.data.image!.image], { type: "image/png" })
        )
      : undefined
  );

  let extra = $derived(
    query.current.data?.extra ? query.current.data.extra.clone() : new Struct()
  );

  function handleCheckContour() {
    query.current.refetch().then((result) => {
      console.log("contour refreshed");
    });
  }

  function handleAccept() {
    console.log("Button Accept: To be implemented");
  }
</script>

<!-- Main Content Area -->

{#if !query.current.error}
  <div class="flex border-0 border-red-500">
    <div class="p-4">
      <!--column left -->
      <img {src} alt="" width="700" />
    </div>
    <div class="flex-col p-4">
      <!--column right -->
      <div
        class="flex flex-col border-0 border-purple-500 items-center justify-center min-h-[200px]"
      >
        <button
          class="bg-blue-500 hover:bg-blue-700 text-xl text-white font-bold py-[50px] px-[100px] mb-20 rounded"
          onclick={handleCheckContour}>Check</button
        >
        <div class="flex-grow"></div>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-xl text-white font-bold py-[50px] px-[100px] rounded"
          onclick={handleAccept}>Accept</button
        >
      </div>
      <div
        class="flex flex-col border-0 border-purple-500 items-center justify-center flex-grow min-h-[100px]"
      ></div>
      <div
        class="flex flex-col border-0 border-purple-500 items-center justify-center min-h-[200px]"
      >
        <!--column right row 2 -->
        <Metrics data={extra} />
      </div>
    </div>
  </div>
{:else}
  {query.current.error.message}
{/if}
