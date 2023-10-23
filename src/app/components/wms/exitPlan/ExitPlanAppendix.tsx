import React, { useEffect } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { useState } from "react";
import { useIntl } from "react-intl";
import AddAppendixDialog from "./AddAppendixDialog";
import { ExitPlan } from "../../../../types/exit_plan";
import { User } from "../../../../types/user";
import { deleteAppendix, getAppendagesByExitPlanId, getAppendagesByOperationInstructionId } from "../../../../services/api.appendix";
import { Appendix } from "../../../../types/appendix";
import { getDateFormat, getHourFormat } from "@/helpers/utilserege1992";
import { isOMS } from "@/helperserege1992";
import { VerticalDotsIcon } from "../../common/VerticalDotsIcon";
import { showMsg } from "@/helperserege1992";
import { OperationInstruction } from "@/types/operation_instructionerege1992";
import { useRouter } from "next/router";

interface Props {
  exitPlan?: ExitPlan;
  operationInstruction?: OperationInstruction;
  owner: User;
}
const ExitPlanAppendix = ({ exitPlan, owner, operationInstruction }: Props) => {
  const intl = useIntl();
  const router = useRouter();
  const { locale } = router.query;
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
      showMsg(intl.formatMessage({id: 'successfullyActionMsg'}), {type: 'success'})
      closeAppendixDialog();
  };

  const loadAppendages = async () => {
    let result = null
    if(exitPlan) {
      result = await getAppendagesByExitPlanId(
        exitPlan.id ? exitPlan.id : -1
      );
    } else {
      result = await getAppendagesByOperationInstructionId(operationInstruction?.id ? operationInstruction.id : -1)
      console.log(owner)
    }
    
    if (result) {
      setAppendages(result);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await deleteAppendix(id)
    await loadAppendages()
    if(result.status < 300) {
      showMsg(intl.formatMessage({id: 'successfullyActionMsg'}), {type: 'success'})
    } else {
      showMsg(intl.formatMessage({id: 'unknownStatusErrorMsg'}), {type: 'error'})
    }
  }

  const handleVisualice = (id: number) => {
    const appendix = appendages.find(el => el.id === id)
    if( appendix ) {
      window.open(appendix.url, appendix.name )
    }
  }

  const getState = (): string => {
    // @ts-ignore
    return exitPlan?.state;
  };

  const cancelSend = () => {
    const exitPId = router.query.exit_plan_id;

    if (exitPId) {
        router.push(
          {
            pathname: `/${locale}/${isOMS() ? "oms" : "wms"}/exit_plan/${exitPId}/config`
          }
        );
    } else {
        router.push(
          `/${locale}/${isOMS() ? "oms" : "wms"}/operation_instruction`
        );
    }
  };

  return (
    <>
      <div style={{ paddingTop: "20px" }}>
        <div
          className="exit-plan-data__header-pl exit-plan-data__header-aprendix-config"
          style={{ paddingRight: "16px", paddingBottom: "10px" }}
        >
          <div className="elements-row-start show-sp-desktop"></div>
          <div className="elements-row-end">
            <Button
              color="primary"
              type="button"
              className={(isOMS() && exitPlan && getState() !== "pending") ? "do-not-show-dropdown-item" : "px-4"}
              onClick={addAppendix}
            >
              {intl.formatMessage({ id: "upload_file" })}
            </Button>
            <Button
              color="primary"
              type="button"
              className='px-4'
              style={{ marginLeft: '10px' }}
              onClick={()=>cancelSend()}
            >
              {intl.formatMessage({ id: 'back' })}
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
            <div className="elements-center" style={{wordBreak: 'break-all', cursor: 'pointer'}}>
              <span className="text-center" onClick={()=> handleVisualice(appendix.id ? appendix.id : -1)}>{appendix.name}</span>
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
                  <Button isIconOnly size="sm" variant="light" aria-labelledby="action-menu">
                    <VerticalDotsIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                  aria-labelledby="visualice-button"
                    onClick={() => handleVisualice(appendix.id ? appendix.id : -1)}
                  >
                    {intl.formatMessage({ id: "vizualice" })}
                  </DropdownItem>
                  <DropdownItem
                    className={(isOMS() && exitPlan && getState() !== "pending") ? "do-not-show-dropdown-item" : ""}
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
        <AddAppendixDialog
          exitPlan={exitPlan}
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

export default ExitPlanAppendix;
