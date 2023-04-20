const ownerId = "contribut3.near";

State.init({
  show: false,
});

const icon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_721_25679)">
      <path
        d="M3.74984 18.3333V14.1667M3.74984 5.83334V1.66667M1.6665 3.75001H5.83317M1.6665 16.25H5.83317M10.8332 2.5L9.38802 6.25739C9.15301 6.86842 9.03551 7.17393 8.85278 7.43091C8.69083 7.65867 8.49184 7.85766 8.26408 8.01961C8.00709 8.20234 7.70158 8.31985 7.09055 8.55486L3.33317 10L7.09056 11.4452C7.70158 11.6802 8.00709 11.7977 8.26408 11.9804C8.49184 12.1423 8.69083 12.3413 8.85278 12.5691C9.03551 12.8261 9.15301 13.1316 9.38802 13.7426L10.8332 17.5L12.2783 13.7426C12.5133 13.1316 12.6308 12.8261 12.8136 12.5691C12.9755 12.3413 13.1745 12.1423 13.4023 11.9804C13.6592 11.7977 13.9648 11.6802 14.5758 11.4452L18.3332 10L14.5758 8.55486C13.9648 8.31985 13.6592 8.20234 13.4023 8.01961C13.1745 7.85766 12.9755 7.65867 12.8136 7.43091C12.6308 7.17393 12.5133 6.86842 12.2783 6.25739L10.8332 2.5Z"
        stroke="white"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_721_25679">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const arrowIcon = (
  <svg
    width="12"
    height="8"
    viewBox="0 0 12 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1.5L6 6.5L11 1.5"
      stroke="white"
      stroke-width="1.66667"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const Arrow = styled.div`
  transition: transform 0.2s ease-in-out;

  &.show {
    transform: rotate(-180deg);
  }
`;

const DropdownDivider = styled.hr`
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.4);
  margin: 0;
`;

const DropdownItem = styled.a`
  display: block;
  width: 100%;
  clear: both;
  padding: 1em;
  font-weight: 400;
  white-space: nowrap;
  text-decoration: none;
  color: black;
  border: 0;
  text-align: left;
  transition: background-color 0.2s ease-in-out;
  background-color: white;

  &:hover {
    color: black;
    text-decoration: none;
    background-color: #e9ecef;
  }
`;

const DropdownLi = styled.li`
  cursor: pointer;
  z-index: 3;
`;

const createNewButton = ({ id, text, icon }) => (
  <DropdownMenu.Item asChild={true}>
    <DropdownLi>
      <DropdownItem
        href={`/${ownerId}/widget/Index?tab=${id}`}
        onClick={() => props.update({ tab: id, content: "" })}
      >
        <i className={icon} />
        <span>{text}</span>
      </DropdownItem>
    </DropdownLi>
  </DropdownMenu.Item>
);

const scaleOut = styled.keyframes`
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
`;

const DropdownList = styled.ul`
  z-index: 3;
  dislpay: block;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  list-style-type: none;
  padding: 0px;
  margin: 0px;
  transform-origin: top right;
  width: 184px;

  &[data-state="open"] {
    animation: ${scaleOut} 0.2s ease-in-out;
  }

  &[data-state="closed"] {
    animation: ${scaleOut} 0.2s ease-in-out reverse;
  }
`;

const MenuIcon = styled.button`
  color: #fff;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0.5em 1em;
  gap: 0.5em;
  background: #11181c;
  border-radius: 50px;
  flex: none;
  order: 1;
  flex-grow: 0;
`;

const DropdownContainer = styled.div`
  position: relative;
  z-index: 3;
`;

const MenuText = styled.span`
  margin: 0 0.2em;
`;

return (
  <DropdownMenu.Root
    asChild={true}
    onOpenChange={(show) => State.update({ show })}
    open={state.show}
  >
    <DropdownMenu.Trigger asChild={true}>
      <MenuIcon>
        {icon}
        <MenuText>Create new...</MenuText>
        <Arrow className={state.show ? "show" : ""}>{arrowIcon}</Arrow>
      </MenuIcon>
    </DropdownMenu.Trigger>

    <DropdownMenu.Content asChild={true}>
      <DropdownList className={state.show ? "show" : ""}>
        {createNewButton({
          id: "createproject",
          text: "Project",
          icon: "bi-boxes",
        })}
        <li>
          <DropdownDivider />
        </li>
        {/*createNewButton({
          id: "createvendor",
          text: "Vendor",
          icon: "bi-diagram-2",
        })*/}
      </DropdownList>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
);
