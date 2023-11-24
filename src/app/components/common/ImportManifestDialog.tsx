import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@nextui-org/react";
import { useIntl } from "react-intl";
import { Carrier, Response } from '../../../types';
import '../../../styles/generic.dialog.scss';
import { FaFileExcel, FaFileDownload } from 'react-icons/fa';
import { showMsg, downloadTemplateCreateManifest, downloadTemplateUpdateCustomer, downloadTemplateUpdateSupplier } from "../../../helpers";
import { capitalize } from "@material-ui/core";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { indexCarriers } from "@/services/api.carrierserege1992";
import React from "react";
import { createManifest, updateCustomerManifest, updateSupplierManifest } from "@/services/api.manifesterege1992";
import { Loading } from "./Loading";
import { Guide } from "@/types/guideerege1992";
import ConfirmationReuploadDialog from "./ConfirmationReuploadDialog";

interface Params {
  close: () => any;
  confirm: () => any;
  title: string;
  where?: string;
  onClose?: (content: Guide[]) => void;
}

const ImportManifestDialog = ({ close, confirm, title, where, onClose }: Params) => {
  const intl = useIntl();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [data, setData] = useState<FormData | undefined>(undefined);

  const [carriers, setCarriers] = useState<Carrier[] | null>([]);
  const [carrierValue, setCarrierValue] = React.useState("");
  const [trackingNumberValue, setTrackingNumberValue] = React.useState("");
  const [clientReferenceValue, setClientReferenceValue] = React.useState("");

  const [loading, setLoading] = useState<boolean>(false);
  const [force, setForce] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);


  useEffect(() => {
    loadCarriers();
  }, []);

  const loadCarriers = async () => {
    const _carriers = await indexCarriers();
    setCarriers(_carriers);
  }

  const handleCloseConfirm = () => {
    setShowConfirm(false);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    setForce(true);
    handleSubmit();
  };

  const closeManifestDialog = (content: Guide[]) => {
    onClose && onClose(content);
  }

  const handleSubmit = async () => {
    if (data !== undefined) {
      let response: Response | undefined = undefined;
      if (where === undefined) {
        setLoading(true);
        response = await createManifest(data, carrierValue, trackingNumberValue, clientReferenceValue, force);
      } else if (where === "customer") {
        setLoading(true);
        response = await updateCustomerManifest(data);
      } else {
        setLoading(true);
        response = await updateSupplierManifest(data);
      }

      if (response !== undefined && response.status >= 200 && response.status <= 299 && response.data !== "" && response.data.errors.length === 0) {
        setLoading(false);
        let message: string = "";
        if (where === undefined) {
          message = intl.formatMessage({ id: "create_manifest_sucessfully" }, { manifest_count: response.data.manifest_count, waybill_id: response.data.waybill_id });
          showMsg(message, { type: "success" });
          confirm();
        } else if (where === "customer") {
          message = intl.formatMessage({ id: "update_customer_manifest_sucessfully" }, { manifest_count: response.data.manifest_count });
          showMsg(message, { type: "success" });
          confirm();
        } else if (response.data.manifest_charged.length === 0) {
          message = intl.formatMessage({ id: "update_supplier_manifest_sucessfully" }, { manifest_charged_count: response.data.manifest_charged_count });
          showMsg(message, { type: "success" });
          confirm();
        } else if (where === "supplier" && response.data.manifest_charged.length > 0) {
          closeManifestDialog(response.data.manifest_charged);
        }
      } else if (response !== undefined && response.status === 205) {
        setLoading(false);
        setShowConfirm(true);
      } else if (response !== undefined && (response.status === 0 || response.status === 503)) {
        setLoading(false);
        let message = intl.formatMessage({ id: "wait_please_loading_items" });
        showMsg(message, { type: "success" });
      } else {
        setLoading(false);
        let message = intl.formatMessage({ id: "unknownStatusErrorMsg" });
        showMsg(message, { type: "error" });
      }
    }
  }

  const onClear = React.useCallback((filter: string) => {
    eval(`set${filter}("")`);
  }, []);

  const handleInputExcel = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const validExtensions = ".xlsx,.xsl";
      const extension = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();
      if (validExtensions.indexOf(extension) === -1) {
        let message = intl.formatMessage({ id: "invalid_extension_xls" });
        showMsg(message, { type: "info" });
      } else {
        const formData = new FormData();
        formData.append('data', file);
        setData(formData);
      }
    }
  }

  const confirmContent = () => {
    return (
      <div style={{ display: "block" }}>
        <div style={{ fontSize: "14px" }}>
          {intl.formatMessage({ id: "manifest_exist" })}
        </div>
        <div style={{ fontSize: "11px", marginTop: 5 }}>
          <p color="warning">{intl.formatMessage({ id: "reupload_note" })}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation_container">
      <div className="confirmation_backdrop" onClick={close}></div>
      <div className="confirmation_card dialog-background">
        <Loading loading={loading} content={intl.formatMessage({ id: "loading_items" })}>
          <div className="confirmation_card_header" style={{ color: 'white' }}>
            <div className="upload-batch-sp-header-dialog">
              <strong>{title}</strong>
              <div
                className="upload_button_evidence"
                onClick={() => {
                  where === undefined ? downloadTemplateCreateManifest() :
                    where === "customer" ? downloadTemplateUpdateCustomer() : downloadTemplateUpdateSupplier()
                }}
              >
                <span>
                  {intl.formatMessage({ id: "template" })}
                </span>
                <FaFileDownload style={{ fontSize: '16px', color: 'white' }} />
              </div>
              <div className="file-upload-button">
                <input
                  type="file"
                  accept=".xlsx,.xsl"
                  id="file-input"
                  onChange={handleInputExcel}
                  ref={fileInputRef}
                  hidden
                />
                <label htmlFor="file-input" className="file-upload-button-text">
                  <div
                    className="upload_button_evidence"
                  >
                    <span>
                      {intl.formatMessage({ id: "upload" })}
                    </span>
                    <FaFileExcel style={{ fontSize: '16px', color: 'white' }} />
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div style={{ width: '500px', maxWidth: '90vw' }}>
            <div className='flex flex-col gap-3'>
              <div className='upload-evidence-body-dialog scrollable-hidden pl-1 pr-1 mt-10 mb-10'>
                {
                  where === undefined ?
                    <div>
                      <div className='flex flex-col gap-3'>
                        <div className='flex mb-5'>
                          <div className="mr-2" style={{ width: "100%" }}>
                            <Input
                              className="search-input"
                              placeholder={intl.formatMessage({ id: "waybill_id" })}
                              value={trackingNumberValue}
                              // onClear={() => onClear("TrackingNumberValue")}
                              onChange={(e) => setTrackingNumberValue(e.target.value)}
                            />
                          </div>
                          <div className="ml-2" style={{ width: "100%" }}>
                            <Input
                              className="search-input"
                              placeholder={intl.formatMessage({ id: "clientReference" })}
                              value={clientReferenceValue}
                              // onClear={() => onClear("ClientReferenceValue")}
                              onChange={(e) => setClientReferenceValue(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div>
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
                    : data === undefined ?
                      <div className="elements-center w-full" style={{ height: '80px' }}>
                        <span>{intl.formatMessage({ id: "please_upload_excel" })}</span>
                      </div>
                      :
                      <div className="elements-center w-full" style={{ height: '80px' }}>
                        <span>{intl.formatMessage({ id: "available_item_to_be_imported" }, { in: 1 })}</span>
                      </div>
                }
              </div>
              <div className="elements-row-end w-full">
                <Button
                  color="primary"
                  type="submit"
                  className="px-4"
                  style={{ marginRight: '15px' }}
                  onClick={handleSubmit}
                  disabled={carrierValue.trim() === "" && where === undefined || data === undefined}
                >
                  {intl.formatMessage({ id: "confirmation_header" })}
                </Button>
                <Button onClick={close} type="button" className="bg-secundary px-4">
                  {intl.formatMessage({ id: "cancel" })}
                </Button>
              </div>
            </div>
          </div>
          {showConfirm && <ConfirmationReuploadDialog content={confirmContent()} close={handleCloseConfirm} confirm={handleConfirm} />}
        </Loading>
      </div>
    </div>
  );
};

export default ImportManifestDialog;