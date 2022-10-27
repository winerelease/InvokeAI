import { createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';
import { useMemo } from 'react';
import { useAppSelector } from '../../app/store';
import { RootState } from '../../app/store';
import { OptionsState } from '../../features/options/optionsSlice';

import { SystemState } from '../../features/system/systemSlice';
import { InpaintingState } from '../../features/tabs/Inpainting/inpaintingSlice';
import { tabMap } from '../../features/tabs/InvokeTabs';
import { validateSeedWeights } from '../util/seedWeightPairs';

export const useCheckParametersSelector = createSelector(
  [
    (state: RootState) => state.options,
    (state: RootState) => state.system,
    (state: RootState) => state.inpainting,
  ],
  (options: OptionsState, system: SystemState, inpainting: InpaintingState) => {
    return {
      // options
      prompt: options.prompt,
      shouldGenerateVariations: options.shouldGenerateVariations,
      seedWeights: options.seedWeights,
      maskPath: options.maskPath,
      initialImagePath: options.initialImagePath,
      seed: options.seed,
      activeTabName: tabMap[options.activeTab],
      // system
      isProcessing: system.isProcessing,
      isConnected: system.isConnected,
      // inpainting
      isMaskEmpty:
        inpainting.lines.filter((line) => line.tool === 'brush').length === 0,
      hasInpaintingImage: Boolean(inpainting.imageToInpaint),
    };
  },
  {
    memoizeOptions: {
      resultEqualityCheck: _.isEqual,
    },
  }
);
/**
 * Checks relevant pieces of state to confirm generation will not deterministically fail.
 * This is used to prevent the 'Generate' button from being clicked.
 */
const useCheckParameters = (): boolean => {
  const {
    prompt,
    shouldGenerateVariations,
    seedWeights,
    maskPath,
    initialImagePath,
    seed,
    activeTabName,
    isProcessing,
    isConnected,
    isMaskEmpty,
    hasInpaintingImage,
  } = useAppSelector(useCheckParametersSelector);

  return useMemo(() => {
    // Cannot generate without a prompt
    if (!prompt || Boolean(prompt.match(/^[\s\r\n]+$/))) {
      return false;
    }

    if (activeTabName === 'img2img' && !initialImagePath) {
      return false;
    }

    if (
      activeTabName === 'inpainting' &&
      (!hasInpaintingImage || isMaskEmpty)
    ) {
      return false;
    }

    //  Cannot generate with a mask without img2img
    if (maskPath && !initialImagePath) {
      return false;
    }

    // TODO: job queue
    // Cannot generate if already processing an image
    if (isProcessing) {
      return false;
    }

    // Cannot generate if not connected
    if (!isConnected) {
      return false;
    }

    // Cannot generate variations without valid seed weights
    if (
      shouldGenerateVariations &&
      (!(validateSeedWeights(seedWeights) || seedWeights === '') || seed === -1)
    ) {
      return false;
    }

    // All good
    return true;
  }, [
    prompt,
    maskPath,
    initialImagePath,
    isProcessing,
    isConnected,
    shouldGenerateVariations,
    seedWeights,
    seed,
    activeTabName,
    isMaskEmpty,
    hasInpaintingImage,
  ]);
};

export default useCheckParameters;
