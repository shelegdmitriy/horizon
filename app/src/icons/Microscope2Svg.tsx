export function Microscope2Svg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.99996 5.5C2.99996 3.01472 5.01468 1 7.49996 1C9.8359 1 11.7561 2.77987 11.9785 5.05742C12.314 5.01947 12.6548 5 13 5C17.9705 5 22 9.02944 22 14C22 17.7786 19.6716 21.011 16.3752 22.3454C15.8632 22.5526 15.2802 22.3056 15.073 21.7937C14.8658 21.2818 15.1128 20.6988 15.6247 20.4915C18.1919 19.4524 20 16.9361 20 14C20 10.134 16.8659 7 13 7C12.66 7 12.3262 7.02416 12 7.07076V12.7639C12.4748 13.1887 12.8127 13.7627 12.9424 14.4148C13.0735 15.0737 13.0739 15.9242 12.9424 16.5854C12.7057 17.7754 11.7754 18.7057 10.5853 18.9424C10.2925 19.0007 9.96463 19.0004 9.58393 19.0001H5.41616C5.03546 19.0004 4.70763 19.0007 4.41478 18.9424C3.2247 18.7057 2.29441 17.7754 2.05769 16.5854C1.92664 15.9265 1.92618 15.076 2.05769 14.4148C2.18738 13.7628 2.52525 13.1888 2.99996 12.7641V5.5Z"
        fill="currentColor"
      />
      <path
        d="M2.99996 21C2.44767 21 1.99996 21.4477 1.99996 22C1.99996 22.5523 2.44767 23 2.99996 23H12C12.5522 23 13 22.5523 13 22C13 21.4477 12.5522 21 12 21H2.99996Z"
        fill="currentColor"
      />
    </svg>
  );
}