import { useEffect, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { useIntl } from "react-intl";
import { Carrier, MWB } from '../../../types';
import '../../../styles/generic.dialog.scss';
import { capitalize } from "@material-ui/core";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { indexCarriers } from "@/services/api.carrierserege1992";
import React from "react";
import { exportExcelManifest } from "@/services/api.manifesterege1992";
import { Loading } from "./Loading";
import { indexWaybillIDS } from "@/services/api.waybillerege1992";
import { showMsg } from "@/helperserege1992";

interface Params {
  close: () => any;
  title: string;
}

const ExportDialog = ({ close, title }: Params) => {
  const intl = useIntl();

  const [carriers, setCarriers] = useState<Carrier[] | null>([]);
  const [waybillIDS, setWaybillIDS] = useState<MWB[] | null>([]);
  const [carrierValue, setCarrierValue] = React.useState("");
  const [waybillIDValue, setWaybillIDValue] = React.useState("");

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadCarriers();
    loadMWB();
  }, []);

  const loadCarriers = async () => {
    const _carriers = await indexCarriers();
    setCarriers(_carriers);
  }

  const loadMWB = async () => {
    const _waybillIDS = await indexWaybillIDS();
    setWaybillIDS(_waybillIDS);
  }

  const handleSubmit = async () => {
    try {
      await exportExcelManifest(waybillIDValue, carrierValue);
    } catch (error) {
      let message = intl.formatMessage({ id: "unknownStatusErrorMsg" });
      showMsg(message, { type: "error" });
    }
  }

  return (
    <div className="confirmation_container">
      <div className="confirmation_backdrop" onClick={close}></div>
      <div className="confirmation_card dialog-background">
        <Loading loading={loading} content={intl.formatMessage({ id: "loading_items" })} >
          <div className="confirmation_card_header" style={{ color: 'white' }}>
            <div className="upload-batch-sp-header-dialog">
              <strong>{title}</strong>
            </div>
          </div>
          <div style={{ width: '500px', maxWidth: '90vw' }}>
            <div className='flex flex-col gap-3'>
              <div className='flex mt-10 mb-10'>
                <div className="mr-2" style={{ width: "100%" }}>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        className="bnt-dropdown"
                        style={{ width: "-webkit-fill-available" }}
                        endContent={<ChevronDownIcon className="text-small" />}
                      >
                        {waybillIDValue.trim() !== "" ? waybillIDValue : intl.formatMessage({ id: "waybill_id" })}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      disallowEmptySelection
                      aria-label="MWB"
                      closeOnSelect={true}
                      selectionMode="single"
                    >
                      {waybillIDS ? waybillIDS.map((column) => (
                        <DropdownItem onClick={(e) => setWaybillIDValue(column.waybill_id)} key={column.waybill_id} className="capitalize">
                          {capitalize(column.waybill_id)}
                        </DropdownItem>
                      )) : []}
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <div className="ml-2" style={{ width: "100%" }}>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        className="bnt-dropdown"
                        style={{ width: "-webkit-fill-available" }}
                        endContent={<ChevronDownIcon className="text-small" />}
                      >
                        {carrierValue.trim() !== "" ? carrierValue : intl.formatMessage({ id: "carrier" })}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      style={{ width: "100%" }}
                      disallowEmptySelection
                      aria-label="Carrier"
                      closeOnSelect={true}
                      selectionMode="single"
                    >
                      {carriers ? carriers.map((column) => (
                        <DropdownItem style={{ width: "100%" }} onClick={(e) => setCarrierValue(column.name)} key={column.position} className="capitalize">
                          {capitalize(column.name)}
                        </DropdownItem>
                      )) : []}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
              <div className="elements-row-end w-full">
                <Button
                  color="primary"
                  type="submit"
                  className="px-4"
                  style={{ marginRight: '15px' }}
                  onClick={handleSubmit}
                  disabled={waybillIDValue === ""}
                >
                  {intl.formatMessage({ id: "confirmation_header" })}
                </Button>
                <Button onClick={close} type="button" className="bg-secundary px-4">
                  {intl.formatMessage({ id: "cancel" })}
                </Button>
              </div>
            </div>
          </div>
        </Loading>
      </div>
    </div>
  );
};

export default ExportDialog;