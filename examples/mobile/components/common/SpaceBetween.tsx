import React from "react";
import { View } from "react-native";

interface SpaceBetweenProps {
  x?: number;
  y?: number;
  divider?: React.ReactNode;
}

const getXSpacing = (width: number) => ({ paddingHorizontal: width / 2 });
const getYSpacing = (height: number) => ({ paddingVertical: height / 2 });

const SpaceBetween: React.FC<SpaceBetweenProps> = ({ children, x = 0, y = 0, divider }) => {
  if (x + y <= 0 && !divider) {
    return <>{children || null}</>;
  }

  let kids = children;

  if (Array.isArray(kids)) {
    kids = kids.filter(Boolean);
  }

  const Spacer = <View style={[getXSpacing(x), getYSpacing(y)]}>{divider || null}</View>;

  return (
    <>
      {React.Children.map(kids, (child, i) => {
        if (i !== 0) {
          return [Spacer, child];
        }

        return child;
      })}
    </>
  );
};

export default SpaceBetween;
