import React, { useState, ChangeEvent, useEffect } from "react";
import { Button } from "@nextui-org/react";
import "../../../../styles/wms/user.form.scss";
import "../../../../styles/wms/exit.plan.config.scss";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { getDateFormat, getHourFormat } from "../../../../helpers/utils";
import { ExitPlanProps } from "../../../../types/exit_plan";
import ExitPlanBox from "./ExitPlanBox";
import ExitPlanAppendix from "./ExitPlanAppendix";
import OperationInstructionTable from "../operationInstruction/OperationInstructionTable";
import { isOMS } from "@/helperserege1992";

const ExitPlanConfig = ({ id, exitPlan }: ExitPlanProps) => {
  const router = useRouter();
  const { locale } = router.query;
  const intl = useIntl();

  const handleAction = (action: number) => {
    switch (action) {
      case 3:
        {
          router.push(`/${locale}/${isOMS() ? 'oms' : 'wms'}/exit_plan/${id}/update`);
        }
        break;
    }
  };

  const getState = (): string => {
    // @ts-ignore
    return exitPlan?.state;
  };

  return (
    <div
      className="user-form-body shadow-small"
      style={{ paddingRight: "0px" }}
    >
      <div className="flex" style={{ paddingRight: "16px" }}>
        <h1 className="flex-1 text-xl font-semibold">
          {intl.formatMessage({ id: "config" })}{" "}
          {intl.formatMessage({ id: "exitPlan" })}
        </h1>
        <div className="w-100">
          <Button
            color="primary"
            type="button"
            className={(isOMS() && exitPlan && getState() !== "pending") ? "do-not-show-dropdown-item" : "px-4"}
            onClick={() => handleAction(3)}
          >
            {intl.formatMessage({ id: "go_to_edit" })}
          </Button>
        </div>
      </div>
      <div className="user-form-body__container">
        <div className="storage-plan-data">
          <div style={{ paddingTop: "10px" }}>
            <div
              className="storage-plan-data__table bg-default-100"
              style={{
                padding: "5px 0px 5px 5px",
                borderRadius: "5px 5px 0 0",
              }}
            >
              <div className="elements-center">
                <span className="text-center">
                  {intl.formatMessage({ id: "delivery_time" })}
                </span>
              </div>
              <div className="elements-center">
                <span className="text-center">
                  {intl.formatMessage({ id: "address" })}
                </span>
              </div>
              <div className="elements-center">
                <span className="text-center">
                  {intl.formatMessage({ id: "observations" })}
                </span>
              </div>
            </div>
            <div
              className="storage-plan-data__table storage-plan-header"
              style={{
                padding: "5px 0px 5px 5px",
                borderRadius: "0 0 5px 5px",
              }}
            >
              <div className="elements-center">
                {exitPlan?.delivered_time
                  ? `${getDateFormat(exitPlan?.delivered_time)} ${getHourFormat(
                      exitPlan.delivered_time
                    )}`
                  : "-"}
              </div>
              <div className="elements-center">
                {exitPlan?.address
                  ? `${exitPlan?.address}, ${exitPlan.city}, ${exitPlan.country}`
                  : "-"}
              </div>
              <div className="elements-center">
                {exitPlan?.observations ? exitPlan?.observations : "-"}
              </div>
            </div>
          </div>
        </div>
        {exitPlan && exitPlan.user && exitPlan.id && (
          <>
            <ExitPlanBox exitPlan={exitPlan} />
            <ExitPlanAppendix exitPlan={exitPlan} owner={exitPlan.user}/>
            <OperationInstructionTable exit_plan_id={exitPlan.id} exit_plan={exitPlan} />
          </>
        )}
      </div>
    </div>
  );
};

export default ExitPlanConfig;
