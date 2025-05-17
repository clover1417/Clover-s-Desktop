import React from 'react';

export interface TriangleProps extends React.HTMLAttributes<HTMLDivElement> {
  top: string;
  left: string;
  scale: string;
  rotation?: string;
}

export function Triangle({
  top,
  left,
  scale,
  rotation = '-60deg',
  style,
  ...rest
}: TriangleProps) {
  return (
    <div
      className="shape-wrapper triangle-wrapper"
      style={{
        position: 'absolute',
        top: top,
        left: left,
        zIndex: 2,
      }}
    >
      <div
        className="triangle"
        style={{
          '--triangle-size': scale,
          '--triangle-rot': rotation,
          ...style,
        } as React.CSSProperties}
        {...rest}
      />
    </div>
  );
}
