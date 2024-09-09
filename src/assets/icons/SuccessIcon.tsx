interface IProps {
  w?: number;
  h?: number;
}
const SuccessIcon = ({ w = 12, h = 12 }: IProps) => {
  return (
    <svg
      width={w + "px"}
      height={h + "px"}
      fill="#000000"
      viewBox="0 0 64 64"
      version="1.1"
      style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLinejoin: "round",
        strokeMiterlimit: 2,
      }}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <rect
          id="Icons"
          x="-512"
          y="-64"
          width="1280"
          height="800"
          style={{ fill: "none" }}
        ></rect>{" "}
        <g id="Icons1">
          {" "}
          <g id="Strike"> </g> <g id="H1"> </g> <g id="H2"> </g>{" "}
          <g id="H3"> </g> <g id="list-ul"> </g> <g id="hamburger-1"> </g>{" "}
          <g id="hamburger-2"> </g> <g id="list-ol"> </g>{" "}
          <g id="list-task"> </g> <g id="trash"> </g>{" "}
          <g id="vertical-menu"> </g> <g id="horizontal-menu"> </g>{" "}
          <g id="sidebar-2"> </g> <g id="Pen"> </g> <g id="Pen1"> </g>{" "}
          <g id="clock"> </g> <g id="external-link"> </g> <g id="hr"> </g>{" "}
          <path
            id="success"
            d="M56.103,16.824l-33.296,33.297l-14.781,-14.78l2.767,-2.767l11.952,11.952l30.53,-30.53c0.943,0.943 1.886,1.886 2.828,2.828Z"
            style={{ fillRule: "nonzero" }}
          ></path>{" "}
          <g id="info"> </g> <g id="warning"> </g> <g id="plus-circle"> </g>{" "}
          <g id="minus-circle"> </g> <g id="vue"> </g> <g id="cog"> </g>{" "}
          <g id="logo"> </g> <g id="radio-check"> </g> <g id="eye-slash"> </g>{" "}
          <g id="eye"> </g> <g id="toggle-off"> </g> <g id="shredder"> </g>{" "}
          <g id="spinner--loading--dots-"> </g> <g id="react"> </g>{" "}
          <g id="check-selected"> </g> <g id="turn-off"> </g>{" "}
          <g id="code-block"> </g> <g id="user"> </g> <g id="coffee-bean"> </g>{" "}
          <g id="coffee-beans">
            {" "}
            <g id="coffee-bean1"> </g>{" "}
          </g>{" "}
          <g id="coffee-bean-filled"> </g>{" "}
          <g id="coffee-beans-filled">
            {" "}
            <g id="coffee-bean2"> </g>{" "}
          </g>{" "}
          <g id="clipboard"> </g> <g id="clipboard-paste"> </g>{" "}
          <g id="clipboard-copy"> </g> <g id="Layer1"> </g>{" "}
        </g>{" "}
      </g>
    </svg>
  );
};

export default SuccessIcon;
