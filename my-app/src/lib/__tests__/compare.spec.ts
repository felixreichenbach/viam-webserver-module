import { comparePartIds, isJsonEqual } from '$lib/compare';
import { describe, it, expect } from 'vitest';

describe('comparePartIds()', () => {
  it('returns added, removed, and unchanged partIDs', () => {
    const last = ['id1', 'id2', 'id3'];
    const current = ['id2', 'id3', 'id4'];

    const { added, removed, unchanged } = comparePartIds(current, last);

    expect(added).toEqual(['id4']);
    expect(removed).toEqual(['id1']);
    expect(unchanged).toEqual(['id2', 'id3']);
  });
});

describe('isJsonEqual()', () => {
  it('returns true if two JSONs have equal values', () => {
    const json1 = {
      key1: true,
      key2: 'value2',
      key3: 3,
      key4: { nested1: true },
    };
    const json2 = {
      key1: true,
      key2: 'value2',
      key3: 3,
      key4: { nested1: true },
    };

    expect(isJsonEqual(json1, json2)).toBe(true);
  });

  it('returns false if two JSONs do not have equal values', () => {
    const json1 = {
      key1: true,
      key2: 'value2',
      key3: 3,
      key4: { nested1: true },
    };
    const json2 = {
      key1: true,
      key2: 'value2',
      key3: 3,
      key4: { nested1: false },
    };

    expect(isJsonEqual(json1, json2)).toBe(false);
  });

  it('returns false if two JSONs do not have the same keys', () => {
    const json1 = {
      key1: true,
      key2: 'value2',
      key3: 3,
      key4: { nested1: true },
    };
    const json2 = {
      key1: true,
      key2: 'value2',
      key3: 3,
    };

    expect(isJsonEqual(json1, json2)).toBe(false);
  });
});
