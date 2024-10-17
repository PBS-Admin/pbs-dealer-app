import { initialState } from '@/app/(protected)/quote/_initialState';

export function updateStateStructure(storedState) {
  const updatedState = { ...initialState };

  for (const [key, value] of Object.entries(storedState)) {
    if (key in updatedState) {
      updatedState[key] = value;
    }
  }

  return updatedState;
}
