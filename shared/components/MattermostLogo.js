// @flow
import * as React from 'react';

type Props = {
  size?: number,
  fill?: string,
  className?: string,
};

function MattermostLogo({ size = 34, fill = '#FFF', className }: Props) {
  return (
    <svg
      fill={fill}
      width={size}
      height={size}
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid"
    >
      <path d="M243.747 73.364c-8.454-18.258-20.692-33.617-36.9-46.516.432 8.756 1.374 27.484 1.374 27.484s1.01 1.327 1.42 1.901c16.38 22.876 22.365 48.231 16.91 75.771-10.94 55.222-64.772 88.91-119.325 75.138-47.892-12.091-79.878-61.06-70.82-109.609 7.15-38.327 29.801-63.859 66.584-76.833l1.333-.504 1.046-.774c4.458-6.304 8.808-12.685 13.45-19.422C63.07 2.762 7.003 47.488.58 115.522c-6.216 65.832 38.17 124.541 101.596 137.424 66.096 13.425 129.017-25.57 148.031-87.976 9.508-31.206 7.283-61.924-6.46-91.606zm-157.31 41.172c2.787 26.487 25.745 44.538 52.302 41.603 26.092-2.884 45.166-28.409 40.227-54.232-3.85-20.134-8.105-40.19-12.188-60.279-1.689-8.313-3.398-16.623-5.19-25.391-.707.621-1.035.883-1.334 1.176-8.94 8.764-17.875 17.533-26.815 26.297-10.886 10.673-21.757 21.36-32.669 32.006-10.944 10.677-15.926 23.707-14.334 38.82z"/>
    </svg>
  );
}

export default MattermostLogo;
