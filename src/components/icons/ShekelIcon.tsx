import type { SVGProps } from 'react';

const ShekelIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M8 21V3h2v7h6V3h2v18h-2v-7h-6v7H8z" />
  </svg>
);

export default ShekelIcon;
