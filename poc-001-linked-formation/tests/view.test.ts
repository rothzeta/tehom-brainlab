import { describe, expect, it } from 'vitest';
import { formations, formationPositions, formationLinks } from '../src/core/formation';
import { createInitialState } from '../src/core/state';
import { applyCommand } from '../src/core/transition';
import { LabSession, MANEUVERS } from '../src/view/lab-state';
import { projectHex } from '../src/view/projection';

function frozen<T>(value: T): T {
  if (value && typeof value === 'object') { Object.values(value).forEach(frozen); Object.freeze(value); }
  return value;
}

describe('P04 formation inspection and command contracts', () => {
  it.each(formations())('exposes core-labelled positions/links for fresh $shape $orientation test setup', (formation) => {
    const lab = new LabSession(); lab.selectFixture(frozen(formation));
    expect(lab.positions).toEqual(formationPositions(formation));
    expect(lab.links).toEqual(formationLinks(formation));
    expect(lab.state).toEqual({ ...createInitialState(), formation });
    for (const maneuver of MANEUVERS) {
      expect(lab.outcome(maneuver)).toEqual(applyCommand(lab.state, { kind: 'maneuver', expectedRevision: lab.state.revision, maneuver }));
    }
  });

  it.each(MANEUVERS)('preview and commit %s use the same transition with unchanged frozen live input', (maneuver) => {
    const lab = new LabSession();
    // Contract must be exercisable for contraction too; fresh Spread is lab setup.
    if (maneuver === 'contract') lab.selectFixture({ shape: 'spread', orientation: 4 });
    const before = frozen(lab.state); const serialized = JSON.stringify(before);
    const expected = applyCommand(before, { kind: 'maneuver', expectedRevision: before.revision, maneuver });
    expect(expected.ok).toBe(true);
    lab.previewManeuver(maneuver);
    expect(JSON.stringify(lab.state)).toBe(serialized);
    expect(lab.preview?.state).toEqual(expected.state);
    const destinations = formationPositions(lab.preview!.state.formation);
    const committed = lab.commit(maneuver);
    expect(committed).toEqual(expected);
    expect(lab.positions).toEqual(destinations);
    expect(lab.preview).toBeUndefined();
    const rotation = maneuver === 'clockwise' || maneuver === 'anticlockwise';
    expect(lab.state.rotationUsed).toBe(rotation);
    expect(lab.state.shapeChangeUsed).toBe(!rotation);
    expect(lab.state.revision).toBe(before.revision + 1);
    for (const second of MANEUVERS) {
      // Restore the committed snapshot before each independent probe.
      lab.reset(); lab.selectFixture(before.formation); lab.commit(maneuver);
      const expectedSecond = applyCommand(committed.state, {
        kind: 'maneuver', expectedRevision: committed.state.revision, maneuver: second,
      });
      const result = lab.commit(second);
      expect(result).toEqual(expectedSecond);
      if ((second === 'clockwise' || second === 'anticlockwise') === rotation) {
        expect(result.ok).toBe(false);
        if (!result.ok) expect(result.error.code).toBe('maneuver-used');
      }
      expect(lab.state).toEqual(result.state);
    }
  });

  it('cancel, reset and fixture changes remove previews; reset removes selection and restores original state', () => {
    const lab = new LabSession(); lab.select('ugallu'); lab.previewManeuver('expand');
    lab.cancel(); expect(lab.preview).toBeUndefined(); expect(lab.state).toEqual(createInitialState());
    lab.previewManeuver('clockwise'); lab.selectFixture({ shape: 'spread', orientation: 3 });
    expect(lab.preview).toBeUndefined(); expect(lab.selected).toBeUndefined();
    lab.select('pazuzu'); lab.previewManeuver('contract'); lab.commit('contract'); lab.reset();
    expect(lab.preview).toBeUndefined(); expect(lab.selected).toBeUndefined(); expect(lab.state).toEqual(createInitialState());
  });

  it('inspection and rejected same-shape previews cannot alter combat state or allowance', () => {
    const lab = new LabSession(); const before = frozen(lab.state);
    lab.select('girtablilu'); lab.previewManeuver('contract');
    expect(lab.selected).toBe('girtablilu'); expect(lab.preview).toBeUndefined(); expect(lab.state).toEqual(before);
    expect(lab.outcome('expand').ok).toBe(true);
  });
});

describe('P04 axial pixel projection', () => {
  it('respects explicit origin/scale and P02 clockwise downward-positive convention', () => {
    const projection = { x: 120, y: 80, spacing: 20 };
    expect(projectHex({ q: 0, r: 0 }, projection)).toEqual({ x: 120, y: 80 });
    const right = projectHex({ q: 1, r: 0 }, projection);
    const clockwise = projectHex({ q: 0, r: 1 }, projection);
    expect(right).toEqual({ x: 140, y: 80 });
    expect(clockwise.x).toBe(130); expect(clockwise.y).toBeCloseTo(80 + 10 * Math.sqrt(3));
    expect(Math.hypot(clockwise.x - 120, clockwise.y - 80)).toBeCloseTo(20);
  });
});
