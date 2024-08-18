interface IProps {
  w?: number;
  h?: number;
}

const Arrow = ({ w = 24, h = 24 }: IProps) => {
  return (
    <svg
      width={w + "px"}
      height={h + "px"}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8.25 4.5 7.5 7.5-7.5 7.5"
      />
    </svg>
  );
};

export default Arrow;
