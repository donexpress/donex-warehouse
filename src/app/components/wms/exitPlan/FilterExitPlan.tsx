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
  onFinish: (data: ExitPlan[]) => any;
  destionations: State[];
}

const INITIAL_VISIBLE_COLUMNS = [
  "amazon",
  "meli",
  "private_address",
];

const FilterExitPlan = ({ onFinish, destionations }: Props) => {
  const [date, setDate] = useState<string>("");
  const [finalDate, setFinalDate] = useState<string>("");
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const intl = useIntl();

  const handleFilter = async () => {
    const columns = getVisibleColumns();
    const data = await getExitPlanByFilter({ initialDate: date, finalDate, location: columns });
    onFinish(data);
  };

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
      className="flex justify-between items-center"
      style={{ marginTop: 10, gap: '10px' }}
    >
      <div className="w-full">
        <Dropdown>
          <DropdownTrigger className="hidden sm:flex">
            <Button
              className="bnt-select"
              endContent={<ChevronDownIcon className="text-small" />}
              variant="flat"
            >
              {intl.formatMessage({ id: "columns" })}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Table Columns"
            closeOnSelect={false}
            selectedKeys={visibleColumns}
            selectionMode="multiple"
            onSelectionChange={setVisibleColumns}
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
          onValueChange={setDate}
        />
      </div>

      <div className="w-full">
        <Input
          style={{ border: "none" }}
          type="date"
          className="search-input"
          startContent={<FaClock />}
          value={finalDate}
          onValueChange={setFinalDate}
        />
      </div>

      <Button color="primary" onClick={handleFilter}>
        <FaFilter />
      </Button>
    </div>
  );
};

export default FilterExitPlan;
