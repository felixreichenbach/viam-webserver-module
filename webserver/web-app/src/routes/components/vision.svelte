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
<div class="flex flex-col gap-6 border-1 border-green-200">
  <h1 class="text-2xl font-bold">Sealant Check</h1>
  {#if !query.current.error}
    <div class="flex h-screen bg-gray-100 border-1 border-red-500">
      <div class="border-b dark:border-gray-700 p-4">
        <p>column left</p>
        <img {src} alt="" width="700" />
      </div>
      <div class="flex-1 flex flex-col">
        <div class="flex-1 border-b border-1 border-purple-500">
          <p>row 1</p>
          <button
            class="bg-blue-500 hover:bg-blue-700 text-xl text-white font-bold py-[50px] px-[100px] mb-20 rounded"
            onclick={handleCheckContour}>Check</button
          >

          <button
            class="bg-blue-500 hover:bg-blue-700 text-xl text-white font-bold py-[50px] px-[100px] rounded"
            onclick={handleAccept}>Accept</button
          >
        </div>
        <div class="flex-1 border-b border-1 border-purple-500">
          <p>row 2</p>
          <Metrics data={extra} />
        </div>
      </div>
    </div>
  {:else}
    {query.current.error.message}
  {/if}
</div>
