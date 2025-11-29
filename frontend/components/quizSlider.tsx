import React from 'react';
import { Box } from './ui/box';
import { Heading } from './ui/heading';
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack
} from './ui/slider';
import { Text } from './ui/text';

interface quizSliderProps {
  value: number;
  onChange: React.Dispatch<React.SetStateAction<number>>;
  title: string;
}

const QuizSlider = ({ title, value, onChange }: quizSliderProps) => {
  return (
    <Box className="p-4">
      <Heading size="md" className="text-center">
        {title}
      </Heading>

      <Box>
        <Box className="flex flex-row justify-between items-center">
          <Text>0</Text>
          <Text>50</Text>
          <Text>100</Text>
        </Box>
        <Slider
          className="my-4"
          defaultValue={30}
          minValue={0}
          maxValue={100}
          value={value}
          onChange={value => {
            onChange(value);
          }}
          size="lg"
          step={1}
          orientation="horizontal"
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb size="lg" />
        </Slider>
      </Box>
    </Box>
  );
};

export default QuizSlider;
