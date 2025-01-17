import { RootState } from 'app/store';
import { useAppDispatch, useAppSelector } from 'app/storeHooks';
import IAISlider from 'common/components/IAISlider';
import { isStagingSelector } from 'features/canvas/store/canvasSelectors';
import { setBrushSize } from 'features/canvas/store/canvasSlice';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

export default function UnifiedCanvasBrushSize() {
  const dispatch = useAppDispatch();

  const brushSize = useAppSelector(
    (state: RootState) => state.canvas.brushSize
  );

  const isStaging = useAppSelector(isStagingSelector);

  useHotkeys(
    ['BracketLeft'],
    () => {
      dispatch(setBrushSize(Math.max(brushSize - 5, 5)));
    },
    {
      enabled: () => !isStaging,
      preventDefault: true,
    },
    [brushSize]
  );

  useHotkeys(
    ['BracketRight'],
    () => {
      dispatch(setBrushSize(Math.min(brushSize + 5, 500)));
    },
    {
      enabled: () => !isStaging,
      preventDefault: true,
    },
    [brushSize]
  );

  return (
    <IAISlider
      label="Size"
      value={brushSize}
      withInput
      onChange={(newSize) => dispatch(setBrushSize(newSize))}
      sliderNumberInputProps={{ max: 500 }}
      inputReadOnly={false}
      width={'100px'}
    />
  );
}
