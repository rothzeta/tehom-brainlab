import { expect, test } from 'vitest';

test('P01 fixture imports without browser globals and returns the declared literal', async () => {
  // Throw on access, even if a future dependency silently adds browser support.
  const saved = new Map<string, PropertyDescriptor | undefined>();
  for (const name of ['window', 'document', 'Phaser']) {
    saved.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, {
      configurable: true,
      get() { throw new Error(`Core accessed browser global: ${name}`); },
    });
  }
  try {
    const { smokeFixture } = await import('../src/core/smoke');
    expect(smokeFixture()).toBe('formation-lab-ready');
  } finally {
    for (const [name, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else Reflect.deleteProperty(globalThis, name);
    }
  }
});

test('unit runner executes under the pinned Bun runtime', () => {
  expect(process.versions.bun).toBe('1.4.2');
});
