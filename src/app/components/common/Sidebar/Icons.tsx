import {
  BiSolidLayer,
  BiUser,
  BiLogoNetlify,
  BiStation,
  BiHome,
  BiPlusCircle,
  BiSolidShip,
} from "react-icons/bi";

interface Props {
  icons: any;
}

const Icons = ({ icons }: Props) => {
  return (
    <>
      {icons === "BiSolidLayer" && <BiSolidLayer />}
      {icons === "BiUser" && <BiUser />}
      {icons === "BiLogoNetlify" && <BiLogoNetlify />}
      {icons === "BiStation" && <BiStation />}
      {icons === "BiHome" && <BiHome />}
      {icons === "BiPlusCircle" && <BiPlusCircle />}
      {icons === "BiSolidShip" && <BiSolidShip />}
    </>
  );
};

export default Icons;
