export { default as ViamProvider } from "./components/provider.svelte";

export {
  useConnectionStatus,
  useRobotClient,
} from "./hooks/robot-clients.svelte";

export { createRobotQuery } from "./hooks/create-robot-query.svelte";
export { createRobotMutation } from "./hooks/create-robot-mutation.svelte";
export { createResourceClient } from "./hooks/create-resource-client.svelte";
export { createResourceQuery } from "./hooks/create-resource-query.svelte";
export { createResourceMutation } from "./hooks/create-resource-mutation.svelte";
export { createStreamClient } from "./hooks/create-stream-client.svelte";

export { useMachineStatus } from "./hooks/machine-status.svelte";
export { useResourceNames } from "./hooks/resource-names.svelte";
