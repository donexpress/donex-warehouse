import React, { useEffect } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useState } from "react";
import { useIntl } from "react-intl";
import { ExitPlan } from "../../../../types/exit_plan";
import { User } from "../../../../types/user";
import {
  deleteAppendix,
  getAppendagesByExitPlanId,
  getAppendagesByOperationInstructionId,
  updateAppendix,
} from "../../../../services/api.appendix";
import { Appendix } from "../../../../types/appendix";
import { getDateFormat, getHourFormat } from "@/helpers/utilserege1992";
import { VerticalDotsIcon } from "../../common/VerticalDotsIcon";
import { showMsg } from "@/helperserege1992";
import { OperationInstruction } from "@/types/operation_instructionerege1992";
import AddAppendixDialog from "../exitPlan/AddAppendixDialog";
import AddAppendixOperationInstructionDialog from "./AddAppendixOperationInstructionDialog";

interface Props {
  operationInstruction?: OperationInstruction;
  owner?: User;
}
const OperationInstructionAppendix = ({
  owner,
  operationInstruction,
}: Props) => {
  const intl = useIntl();
  const [showAppendixDialog, setShowAppendixDialog] = useState<boolean>(false);
  const [appendages, setAppendages] = useState<Appendix[]>([]);
  useEffect(() => {
    loadAppendages();
  }, []);

  const addAppendix = () => {
    setShowAppendixDialog(true);
  };

  const closeAppendixDialog = () => {
    setShowAppendixDialog(false);
  };

  const confirmAppendixDialog = async () => {
    await loadAppendages();
    showMsg(intl.formatMessage({ id: "successfullyActionMsg" }), {
      type: "success",
    });
    closeAppendixDialog();
  };

  const loadAppendages = async () => {
    let result = null;
    result = await getAppendagesByOperationInstructionId(
      operationInstruction?.id ? operationInstruction.id : -1
    );

    if (result) {
      setAppendages(result);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await deleteAppendix(id);
    await loadAppendages();
    if (result.status < 300) {
      showMsg(intl.formatMessage({ id: "successfullyActionMsg" }), {
        type: "success",
      });
    } else {
      showMsg(intl.formatMessage({ id: "unknownStatusErrorMsg" }), {
        type: "error",
      });
    }
  };

  const handleVisualice = (id: number) => {
    const appendix = appendages.find((el) => el.id === id);
    if (appendix) {
      window.open(appendix.url, appendix.name);
    }
  };
  const updateApendages = async () => {
    if (owner && operationInstruction) {
      for (let i = 0; i < appendages.length; i++) {
        const values = appendages[i];
        if (values.id) {
          values.user_id = owner.id;
          values.operation_instruction_id = operationInstruction.id;
          delete values.user
          console.log(operationInstruction)
          const result = await updateAppendix(values.id, values);
        }
      }
    }
  };

  useEffect(() => {
    if (owner && operationInstruction) {
      updateApendages();
    }
  }, [owner, operationInstruction]);

  return (
    <>
      <div style={{ paddingTop: "20px" }}>
        <div
          className="exit-plan-data__header-pl"
          style={{ paddingRight: "16px", paddingBottom: "10px" }}
        >
          <div className="elements-row-start show-sp-desktop"></div>
          <div className="elements-center-end">
            <Button
              color="primary"
              type="button"
              className="px-4"
              onClick={addAppendix}
            >
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
        {appendages.map((appendix, index) => (
          <div
            key={index}
            className="infoExitPlanAppendixList__table storage-plan-header"
            style={{
              padding: "5px 0px 5px 5px",
              borderRadius: "5px 5px 5px 5px",
            }}
          >
            <div className="elements-center" style={{ wordBreak: "break-all" }}>
              <span style={{cursor: 'pointer'}} className="text-center" onClick={() => handleVisualice(appendix.id ? appendix.id : 1)}>{appendix.name}</span>
            </div>
            <div className="elements-center">
              <span className="text-center">{appendix.user?.nickname}</span>
            </div>
            <div className="elements-center">
              <span className="text-center">
                {getDateFormat(appendix.created_at ? appendix.created_at : "")}:{" "}
                {getHourFormat(appendix.created_at ? appendix.created_at : "")}
              </span>
            </div>
            <div className="elements-center">
              <span className="text-center">{appendix.function}</span>
            </div>
            <div className="elements-center">
              <Dropdown aria-labelledby="action-menu">
                <DropdownTrigger aria-labelledby="action-menu">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    aria-labelledby="action-menu"
                  >
                    <VerticalDotsIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    aria-labelledby="visualice-button"
                    onClick={() =>
                      handleVisualice(appendix.id ? appendix.id : -1)
                    }
                  >
                    {intl.formatMessage({ id: "vizualice" })}
                  </DropdownItem>
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
        <AddAppendixOperationInstructionDialog
          owner={owner}
          operationInstruction={operationInstruction}
          close={closeAppendixDialog}
          confirm={confirmAppendixDialog}
          title={intl.formatMessage({ id: "create_appendix" })}
        />
      )}
    </>
  );
};

export default OperationInstructionAppendix;
