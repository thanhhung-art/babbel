interface IProps {
  w?: number;
  h?: number;
}

const DotMenuIcon = ({ w = 24, h = 24 }: IProps) => {
  return (
    <svg
      fill="#000000"
      width={w + "px"}
      height={h + "px"}
      viewBox="0 0 32 32"
      enableBackground="new 0 0 32 32"
      id="Glyph"
      version="1.1"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M13,16c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,14.346,13,16z"
          id="XMLID_294_"
        ></path>
        <path
          d="M13,26c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,24.346,13,26z"
          id="XMLID_295_"
        ></path>
        <path
          d="M13,6c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,4.346,13,6z"
          id="XMLID_297_"
        ></path>
      </g>
    </svg>
  );
};

export default DotMenuIcon;
