import React, { useState } from "react";
import { useIntl } from "react-intl";
import { SearchIcon } from "../../common/SearchIcon";
import { Button, Input} from "@nextui-org/react";
import { FaClock, FaFilter } from "react-icons/fa";
import { FaLocationPin } from "react-icons/fa6";
import { getExitPlanByFilter } from "../../../../services/api.exit_plan";
import { ExitPlan, State } from "@/types/exit_planerege1992";
import { ValueSelect } from "@/typeserege1992";
import { getLanguage } from "@/helpers/utilserege1992";
import "../../../../styles/wms/exit.plan.config.scss";
interface Props {
  onFinish: (data: ExitPlan[]) => any;
  destionations: State[]
}

const FilterExitPlan = ({ onFinish, destionations }: Props) => {
  const [location, setLocation] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const intl = useIntl();

  const handleFilter = async () => {
    const data = await getExitPlanByFilter({ date, location });
    onFinish(data);
  };

  const getDestinationsFormatted = (dests: State[]): ValueSelect[] => {
    let response: ValueSelect[] = [];
    response.push({
      label: intl.formatMessage({ id: "selectOption" }),
      value: ''
    })
    dests.forEach((dest) => {
      response.push({
        value: dest.value,
        label: dest[getLanguage(intl)],
      });
    });
    return response;
  };

  const changeSelect = (evt: any) => {
    setLocation(evt.target.value)
  }

  return (
    <div className="flex justify-between items-center" style={{marginTop: 10}}>
      <div className="w-full sm:w-[39%]">
        <select className="search-input custom-select" value={location} onChange={changeSelect} style={{width: '100%', padding: '10px'}}>
          {getDestinationsFormatted(destionations).map((dest, key) => (
            <option key={key} value={dest.value}>{dest.label}</option>
          ))}
        </select>
      </div>
      <div className="w-full sm:w-[39%]">
        <Input
          style={{ border: "none" }}
          type="date"
          className="search-input"
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
