import cx from "classnames";
import React from "react";

type SpaceBetweenProps = {
  /** className applied to components to space them apart.
   * Working in the horizontal dimension, you want to use a variant of left spacing, pl, ml
   * Working in the vertical dimension, you want to use a variant of top spacing, pt, mt
   */
  className: string;
  /** component to use between spaced items, spacing will be applied to this item as well */
  divider?: React.ReactNode;
};

export const SpaceBetween: React.FC<SpaceBetweenProps> = ({ children, className, divider }) => {
  let kids = children;

  if (children && (children as React.ReactElement).type === React.Fragment) {
    kids = (children as React.ReactElement).props.children;
  }

  if (Array.isArray(kids)) {
    kids = kids.filter(Boolean);
  }

  let dividerComponent: React.ReactNode | null = null;

  if (React.isValidElement(divider)) {
    dividerComponent = React.cloneElement(divider, {
      className: cx(divider.props.className, className),
    });
  }

  return (
    <>
      {React.Children.map(kids, (child, i) => {
        let kid = child;

        if (i !== 0 && React.isValidElement(child)) {
          kid = React.cloneElement(child as React.ReactElement, {
            className: cx(child.props.className, className),
          });
        }

        if (dividerComponent && i !== 0) {
          return [dividerComponent, kid];
        }

        return kid;
      })}
    </>
  );
};
