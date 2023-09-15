import React, { useState } from "react";
import { useIntl } from "react-intl";
import { SearchIcon } from "../../common/SearchIcon";
import { Button, Input } from "@nextui-org/react";
import { FaClock, FaFilter } from "react-icons/fa";
import { FaLocationPin } from "react-icons/fa6";
import { getExitPlanByFilter } from "../../../../services/api.exit_plan";
import { ExitPlan } from "@/types/exit_planerege1992";

interface Props {
    onFinish: (data: ExitPlan[]) => any
}

const FilterExitPlan = ({onFinish}: Props) => {
  const [location, setLocation] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const intl = useIntl();

  const handleFilter = async () => {
    const data = await getExitPlanByFilter({date, location})
    onFinish(data)
  }

  return (
    <div className="flex justify-between items-center" style={{ width: "40%" }}>
      <div className="w-full sm:w-[39%]">
        <Input
          isClearable
          className="search-input"
          placeholder=""
        startContent={<FaLocationPin />}
          value={location}
          onValueChange={setLocation}
        />
      </div>
      <div className="w-full sm:w-[39%]">
        <Input
          type="datetime-local"
          className="search-input"
          placeholder=""
        startContent={<FaClock />}
          value={date}
          onValueChange={setDate}
        />
      </div>
      <Button color="primary" onClick={handleFilter}>
        <FaFilter />
      </Button>
    </div>
  );
};

export default FilterExitPlan;
