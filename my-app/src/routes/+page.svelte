<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import * as VIAM from "@viamrobotics/sdk";

  let apiKeyId = import.meta.env.VITE_API_KEY_ID;
  let apiKey = import.meta.env.VITE_API_KEY;
  const host = document.location.hostname; // <not supported by the sdk yet> for local gRPC connection something like "ROBOT-XYZ.local:8080";
  let errorMessage = writable("");
  let isLoggedIn = writable(false);
  let machine: VIAM.RobotClient | undefined = undefined;

  const handleLogin = async () => {
    console.log(host);
    const dialConf: VIAM.DialConf = {
      host,
      credentials: {
        type: "api-key",
        payload: apiKey,
        authEntity: apiKeyId,
      },
      //signalingAddress: "https://app.viam.com:4434",
    };

    try {
      const machine = await VIAM.createRobotClient(dialConf);
      console.log("Machine connected", await machine.getCloudMetadata());
      isLoggedIn.set(true);
    } catch (error) {
      errorMessage.set("An unknown error occurred");
    }
  };

  onMount(() => {
    // Any initialization logic can go here
  });
</script>

<main>
  {#if $isLoggedIn}
    <h1>Logged in</h1>
    <!-- Add more content for logged-in users here -->
  {:else}
    <h1>Login</h1>
    <form on:submit|preventDefault={handleLogin}>
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" bind:value={apiKeyId} required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" bind:value={apiKey} required />
      </div>
      <button type="submit">Login</button>
    </form>
    {#if $errorMessage}
      <p style="color: red;">{$errorMessage}</p>
    {/if}
  {/if}
</main>

<style>
  main {
    max-width: 400px;
    margin: 0 auto;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  div {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    box-sizing: border-box;
  }

  button {
    width: 100%;
    padding: 0.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }
</style>
