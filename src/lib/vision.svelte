<script lang="ts">
  import {
    createResourceClient,
    createResourceMutation,
    createResourceQuery,
  } from "$lib";
  import VisionControl from "$lib/vision-control.svelte";
  import VisionData from "$lib/vision-data.svelte";
  import { VisionClient, Struct } from "@viamrobotics/sdk";

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

  const mutation = createResourceMutation(
    visionClient, // client
    "doCommand" // method
  );

  const src = $derived(
    query.current.data
      ? URL.createObjectURL(
          new Blob([query.current.data.image!.image], { type: "image/png" })
        )
      : undefined
  );

  const data = $derived(query.current.data);
  const imgUUID = $derived(
    query.current.data?.extra &&
      (query.current.data.extra.toJson() as any)["id"]
  );

  function handleCheckContour() {
    query.current.refetch().then(() => {
      mutation.current.reset();
    });
  }

  function handleAccept() {
    mutation.current.mutate(
      [
        Struct.fromJson({
          command: "upload_image",
          img_id: imgUUID as string,
        }),
      ],
      {
        onSuccess: () => {
          console.log("tagImage", imgUUID);
        },
        onError(error, variables, context) {
          console.error("Error saving image:", error);
        },
      }
    );
  }
</script>

{#if query.current.error}
  {query.current.error.message}
{:else}
  <div class="grid grid-cols-2 min-w-[400px] border-0 border-red-500">
    <div class="flex flex-col border-0 border-amber-300">
      <div class=""><img {src} alt="" width="700" /></div>
    </div>
    <div class="flex flex-col border-0 border-purple-300">
      <div class="flex flex-col items-center justify-center gap-4 h-full">
        <VisionControl {handleCheckContour} {handleAccept} />
        {#if mutation.current.isSuccess}
          <div class="flex flex-col items-center justify-center gap-4 h-full">
            <h1 class="text-3xl font-bold">Image Saved</h1>
          </div>
        {:else if mutation.current.isError}
          <div class="flex flex-col items-center justify-center gap-4 h-full">
            <h1 class="text-3xl font-bold">Error Saving Image</h1>
            <p>{mutation.current.error.message}</p>
          </div>
        {:else}
          <VisionData {data} />
        {/if}
      </div>
    </div>
  </div>
{/if}
