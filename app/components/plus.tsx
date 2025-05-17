import React from 'react';

export interface PlusProps extends React.HTMLAttributes<HTMLDivElement> {
  top: string;
  left: string;
  size: string;
  rotation?: string;
}

export function Plus({
  top,
  left,
  size,
  rotation = '0deg',
  style,
  ...rest
}: PlusProps) {
  return (
    <div
      className="shape-wrapper plus-wrapper"
      style={{
        position: 'absolute',
        top: top,
        left: left,
        zIndex: 2,
      }}
    >
      <div
        className="plus"
        style={{
          '--plus-size': size,
          '--plus-rot': rotation,
          ...style,
        } as React.CSSProperties}
        {...rest}
      >
        <span className="bar" />
        <span className="bar" />
      </div>
    </div>
  );
}