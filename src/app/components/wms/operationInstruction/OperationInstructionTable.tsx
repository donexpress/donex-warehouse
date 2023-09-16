import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { getLanguage } from "../../../../helpers/utils";
import { ExitPlanState, } from "@/types/exit_planerege1992";
import { getOperationInstructionStates } from "../../../../services/api.operation_instruction";

const OperationInstructionTable = () => {
  const intl = useIntl();
  const [operationInstructionState, setOperationInstructionState] = useState<ExitPlanState | null>(null);
  const [statusSelected, setStatusSelected] = useState<number>(1);

  useEffect(() => {
    loadStates()
  }, [])
  const loadStates = async () => {
    const states = await getOperationInstructionStates();
    setOperationInstructionState(states)
}

  const changeTab = (tab: number) => {};
  return (
    <div style={{marginTop: '20px'}}>
      <div className="bg-gray-200 pt-1">
        <div className="overflow-x-auto tab-system-table bg-content1">
          <ul className="flex space-x-4" style={{backgroundColor: '#37446b', borderRadius: '5px', width: '99%'}}>
            {operationInstructionState &&
              operationInstructionState.states.map((state: any, index) => (
                <li className="whitespace-nowrap" key={index}>
                  <button
                    className={
                      statusSelected === state.position
                        ? "px-4 py-3 tab-selected"
                        : "px-4 py-3 tab-default"
                    }
                    onClick={() => changeTab(state.position)}
                  >
                    {state[getLanguage(intl)]}
                    {state.position === statusSelected &&
                      ` (${operationInstructionState.states.length})`}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OperationInstructionTable;
