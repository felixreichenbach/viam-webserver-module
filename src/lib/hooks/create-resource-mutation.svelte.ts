import { createMutation, type MutationOptions } from '@tanstack/svelte-query';
import type { Resource } from '@viamrobotics/sdk';

import type {
  ArgumentsType,
  ResolvedReturnType,
} from './create-resource-query.svelte';
import { fromStore, toStore } from 'svelte/store';

export const createResourceMutation = <T extends Resource, K extends keyof T>(
  client: { current: T | undefined },
  method: K
) => {
  type MutArgs = ArgumentsType<T[K]>;
  type MutReturn = ResolvedReturnType<T[K]>;

  const mutationOptions = $derived({
    mutationKey: [
      'partID',
      (client.current as T & { partID: string })?.partID,
      'resource',
      client.current?.name,
      String(method),
    ],
    mutationFn: async (request) => {
      const clientFunc = client.current?.[method];

      if (typeof clientFunc !== 'function') {
        throw new TypeError(
          `${String(method)} is not a method on the resource client.`
        );
      }

      return clientFunc.apply(client.current, request) as Promise<MutReturn>;
    },
  } satisfies MutationOptions<MutReturn, Error, MutArgs>);

  return fromStore(createMutation(toStore(() => mutationOptions)));
};
