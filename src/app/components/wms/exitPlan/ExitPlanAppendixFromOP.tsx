import React, { useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { useIntl } from "react-intl";
import AddAppendixFromOPDialog from "./AddAppendixFromOPDialog";
import { User } from "../../../../types/user";
import { isOMS } from "@/helperserege1992";
import { VerticalDotsIcon } from "../../common/VerticalDotsIcon";
import { useRouter } from "next/router";
import { Staff } from "@/types/stafferege1992";
import { AppendixFromOPBody } from "../../../../types/appendix";

interface Props {
  owner: User | Staff;
  updateAppendix: (values: AppendixFromOPBody[]) => any;
}
const ExitPlanAppendixFromOP = ({ owner, updateAppendix }: Props) => {
  const intl = useIntl();
  const router = useRouter();
  const { locale } = router.query;
  const [showAppendixDialog, setShowAppendixDialog] = useState<boolean>(false);
  const [appendages, setAppendages] = useState<AppendixFromOPBody[]>([]);

  const addAppendix = () => {
    setShowAppendixDialog(true);
  };

  const closeAppendixDialog = () => {
    setShowAppendixDialog(false);
  };

  const confirmAppendixDialog = (value: AppendixFromOPBody) => {
    value.id = appendages.length === 0 ? 1 : (Number(appendages[appendages.length-1].id) + 1);
    let appdgs: AppendixFromOPBody[] = appendages.concat(value);
    setAppendages(appdgs);
    updateAppendix(appdgs);
    closeAppendixDialog();
  };

  const handleDelete = async (id: number) => {
    let appdgs: AppendixFromOPBody[] = appendages.filter(element => element.id !== id);
    setAppendages(appdgs);
    updateAppendix(appdgs);
  }

  return (
    <>
      <div style={{ paddingTop: "20px" }}>
        <div
          className="exit-plan-data__header-pl exit-plan-data__header-aprendix-config"
          style={{ paddingBottom: "10px" }}
        >
          <div className="elements-row-start show-sp-desktop"></div>
          <div className="elements-row-end">
            <Button
              color="primary"
              type="button"
              className={"px-4"}
              onClick={addAppendix}
            >
              {intl.formatMessage({ id: "upload_file" })}
            </Button>
          </div>
        </div>
        <div
          className="ExitPlanAppendix__table2 bg-default-100"
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
              {intl.formatMessage({ id: "function" })}
            </span>
          </div>
          <div className="elements-center">
            <span className="text-center">
              {intl.formatMessage({ id: "actions" })}
            </span>
          </div>
        </div>
        {appendages.map((appendix, index) => (
          <div
            key={index}
            className="infoExitPlanAppendixList__table2 storage-plan-header"
            style={{
              padding: "5px 0px 5px 5px",
              borderRadius: "5px 5px 5px 5px",
            }}
          >
            <div className="elements-center" style={{wordBreak: 'break-all', cursor: 'pointer'}}>
              <span className="text-center">{appendix.name}</span>
            </div>
            <div className="elements-center">
              <span className="text-center">{owner.username}</span>
            </div>
            <div className="elements-center">
              <span className="text-center">{appendix.function}</span>
            </div>
            <div className="elements-center">
              <Dropdown aria-labelledby="action-menu">
                <DropdownTrigger aria-labelledby="action-menu">
                  <Button isIconOnly size="sm" variant="light" aria-labelledby="action-menu">
                    <VerticalDotsIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    aria-labelledby="delete-button"
                    onClick={() => handleDelete(appendix.id ? appendix.id : -1)}
                  >
                    {intl.formatMessage({ id: "Delete" })}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        ))}
      </div>
      {showAppendixDialog && (
        <AddAppendixFromOPDialog
          owner={owner}
          close={closeAppendixDialog}
          confirm={confirmAppendixDialog}
          title={intl.formatMessage({ id: "create_appendix" })}
        />
      )}
    </>
  );
};

export default ExitPlanAppendixFromOP;
