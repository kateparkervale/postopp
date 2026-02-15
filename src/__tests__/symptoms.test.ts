import { describe, it, expect } from 'vitest';
import {
  SYMPTOM_CATALOG,
  DEFAULT_ACTIVE_IDS,
  getSymptomById,
  findSymptom,
} from '@/db/symptoms';

describe('SYMPTOM_CATALOG', () => {
  it('has 16 entries', () => {
    expect(SYMPTOM_CATALOG).toHaveLength(16);
  });
});

describe('DEFAULT_ACTIVE_IDS', () => {
  it('has 4 entries', () => {
    expect(DEFAULT_ACTIVE_IDS).toHaveLength(4);
  });
});

describe('getSymptomById', () => {
  it('returns correct symptom for known id', () => {
    const symptom = getSymptomById('ptsd');
    expect(symptom).toBeDefined();
    expect(symptom!.name).toBe('PTSD Episode');
    expect(symptom!.category).toBe('mental-health');
  });

  it('returns undefined for unknown id', () => {
    const symptom = getSymptomById('nonexistent');
    expect(symptom).toBeUndefined();
  });
});

describe('findSymptom', () => {
  it('finds catalog symptoms', () => {
    const symptom = findSymptom('migraine', []);
    expect(symptom).toBeDefined();
    expect(symptom!.name).toBe('Migraine');
  });

  it('finds custom symptoms from provided array', () => {
    const customs = [
      { id: 'custom-1', name: 'Custom Ache', shortName: 'Custom', icon: '🩹', color: '#FF0000' },
    ];
    const symptom = findSymptom('custom-1', customs);
    expect(symptom).toBeDefined();
    expect(symptom!.name).toBe('Custom Ache');
    expect(symptom!.category).toBe('general');
  });

  it('returns undefined when not found in catalog or custom list', () => {
    const symptom = findSymptom('nonexistent', []);
    expect(symptom).toBeUndefined();
  });
});
