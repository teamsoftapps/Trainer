// StoryRing.jsx
import React from 'react';
import Svg, {Circle} from 'react-native-svg';

const StoryRing = ({
  size = 82,
  count = 1,
  color = '#9FED3A',
  strokeWidth = 4,
}) => {
  if (count === 0) return null;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const gap = count > 1 ? 5 : 0;
  const segmentLength = circumference / count;
  const dashLength = segmentLength - gap;

  return (
    <Svg width={size} height={size}>
      {Array.from({length: count}).map((_, i) => (
        <Circle
          key={i}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${dashLength} ${gap}`}
          strokeDashoffset={-segmentLength * i}
          strokeLinecap="round"
        />
      ))}
    </Svg>
  );
};

export default StoryRing;
