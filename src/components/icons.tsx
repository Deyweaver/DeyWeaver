import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="120"
      height="30"
      aria-label="Dey Weaver Logo"
      {...props}
    >
      <rect width="200" height="50" fill="transparent" />
      <text
        x="10"
        y="35"
        fontFamily="sans-serif"
        fontSize="28"
        fontWeight="bold"
        fill="currentColor"
      >
        Dey Weaver
      </text>
    </svg>
  );
}

export function IconSpinner(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
      className={`animate-spin ${props.className || ""}`}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
