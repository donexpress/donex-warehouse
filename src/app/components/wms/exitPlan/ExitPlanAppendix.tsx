import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useIntl } from "react-intl";

const ExitPlanAppendix = () => {
  const intl = useIntl();

  const handleAction = (id: number) => {};
  return (
    <div style={{ paddingTop: "20px" }}>
      <div
        className="storage-plan-data__header-pl"
        style={{ paddingRight: "16px", paddingBottom: "10px" }}
      >
        <div className="elements-row-start show-sp-desktop"></div>
        <div className="elements-center-end">
          <Button color="primary" type="button" className="px-4">
            {intl.formatMessage({ id: "upload_file" })}
          </Button>
        </div>
      </div>
      <div
        className="ExitPlanAppendix__table bg-default-100"
        style={{
          padding: "5px 0px 5px 5px",
          borderRadius: "5px 5px 5px 5px",
        }}
      >
        <div className="elements-center">
          <span className="text-center">
            {intl.formatMessage({ id: "file_name" })}
          </span>
        </div>
        <div className="elements-center">
          <span className="text-center">
            {intl.formatMessage({ id: "owner" })}
          </span>
        </div>
        <div className="elements-center">
          <span className="text-center">
            {intl.formatMessage({ id: "created_at" })}
          </span>
        </div>
        <div className="elements-center">
          <span className="text-center">
            {intl.formatMessage({ id: "function" })}
          </span>
        </div>
        <div className="elements-center">
          <span className="text-center">
            {intl.formatMessage({ id: "actions" })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExitPlanAppendix;
