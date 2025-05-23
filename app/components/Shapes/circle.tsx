import React from 'react';

export interface CircleProps extends React.HTMLAttributes<HTMLDivElement> {
  top: string;
  left: string;
  size: string;
}

export function Circle({
  top,
  left,
  size,
  ...rest
}: CircleProps) {
  return (
    <div
      className="shape-wrapper circle-wrapper"
      style={{
        position: 'absolute',
        top: top,
        left: left,
      }}
    >
      <div
        className="circle"
        style={{
          '--circle-size': size,
        } as React.CSSProperties}
        {...rest}
      />
    </div>
  );
}

