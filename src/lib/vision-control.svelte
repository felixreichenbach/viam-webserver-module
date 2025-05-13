<script lang="ts">
  export let handleCheckContour: () => void;
  export let handleAccept: () => void;
</script>

<button onclick={handleCheckContour}>Refresh</button>

<button onclick={handleAccept}>Accept</button>

<style lang="postcss">
  @reference "tailwindcss";
  button {
    @apply w-70 h-30 border-2 flex justify-center items-center rounded bg-blue-500 hover:bg-blue-700 text-xl text-white font-bold py-[50px] px-[100px] mt-4;
  }
</style>
