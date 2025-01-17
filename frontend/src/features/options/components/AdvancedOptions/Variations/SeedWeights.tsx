import React, { ChangeEvent } from 'react';
import { RootState } from 'app/store';
import { useAppDispatch, useAppSelector } from 'app/storeHooks';
import IAIInput from 'common/components/IAIInput';
import { validateSeedWeights } from 'common/util/seedWeightPairs';
import { setSeedWeights } from 'features/options/store/optionsSlice';

export default function SeedWeights() {
  const seedWeights = useAppSelector(
    (state: RootState) => state.options.seedWeights
  );

  const shouldGenerateVariations = useAppSelector(
    (state: RootState) => state.options.shouldGenerateVariations
  );

  const dispatch = useAppDispatch();

  const handleChangeSeedWeights = (e: ChangeEvent<HTMLInputElement>) =>
    dispatch(setSeedWeights(e.target.value));

  return (
    <IAIInput
      label={'Seed Weights'}
      value={seedWeights}
      isInvalid={
        shouldGenerateVariations &&
        !(validateSeedWeights(seedWeights) || seedWeights === '')
      }
      isDisabled={!shouldGenerateVariations}
      onChange={handleChangeSeedWeights}
    />
  );
}
