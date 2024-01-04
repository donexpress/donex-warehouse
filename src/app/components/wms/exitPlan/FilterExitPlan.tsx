import React, { useState } from "react";
import { useIntl } from "react-intl";
import { SearchIcon } from "../../common/SearchIcon";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Selection } from "@nextui-org/react";
import { FaClock, FaFilter } from "react-icons/fa";
import { FaLocationPin } from "react-icons/fa6";
import { getExitPlanByFilter } from "../../../../services/api.exit_plan";
import { ExitPlan, State } from "@/types/exit_planerege1992";
import { ValueSelect } from "@/typeserege1992";
import { capitalize, getLanguage } from "@/helpers/utilserege1992";
import "../../../../styles/wms/exit.plan.config.scss";
import { ChevronDownIcon } from "../../common/ChevronDownIcon";
interface Props {
  date: string;
  finalDate: string;
  visibleColumns: Selection;
  setParentInitialDate: (date: string) => any;
  setParentFinalDate: (date: string) => any;
  setParentLocations: (locations: string[]) => any;
  setVisibleColumnsLocations: (locations: Selection) => any;
}

const INITIAL_VISIBLE_COLUMNS = [
  "amazon",
  "meli",
  "private_address",
];

const FilterExitPlan = ({ date, finalDate, visibleColumns, setParentFinalDate, setParentInitialDate, setParentLocations, setVisibleColumnsLocations }: Props) => {
  const intl = useIntl();

  //const handleFilter = async () => {
  //  onFinish();
  //};

  const getVisibleColumns = (): string[] => {
    const t = Array.from(visibleColumns) as string[];
    return t.filter((el) => el !== "actions");
  };

  const getColumns = React.useMemo(() => {
    const columns = [
      {
        name: intl.formatMessage({ id: "amazon" }),
        uid: "amazon",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "meli" }),
        uid: "meli",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "private_address" }),
        uid: "private_address",
        sortable: true,
      },
    ];

    return columns;
  }, [intl]);

  return (
    <div
      className="container-search-inputs"
    >
      <div className="w-full search-container-generic">
        <Dropdown>
          <DropdownTrigger className="hidden sm:flex">
            <Button
              className="bnt-select bnt-dropdown"
              endContent={<ChevronDownIcon className="text-small" />}
              variant="flat"
            >
              {intl.formatMessage({ id: "destination" })}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Table Columns"
            closeOnSelect={false}
            selectedKeys={visibleColumns}
            selectionMode="multiple"
            onSelectionChange={(value) => {
              setVisibleColumnsLocations(value)
              setParentLocations(Array.from(value) as string[])
            }}
          >
            {getColumns.map((column) => (
              <DropdownItem key={column.uid} className="capitalize">
                {capitalize(column.name)}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="w-full">
        <Input
          style={{ border: "none" }}
          type="date"
          className="search-input"
          startContent={<FaClock />}
          value={date}
          onValueChange={(value: string)=> {
            setParentInitialDate(value)
          }}
        />
      </div>

      <div className="w-full">
        <Input
          style={{ border: "none" }}
          type="date"
          className="search-input"
          startContent={<FaClock />}
          value={finalDate}
          onValueChange={(value: string) => {
            setParentFinalDate(value)
          }}
        />
      </div>
    </div>
  );
};

export default FilterExitPlan;
