import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
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

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadCarriers();
  }, []);

  const loadCarriers = async () => {
    const _carriers = await indexCarriers();
    setCarriers(_carriers);
  }

  const closeManifestDialog = (content: Guide[]) => {
    onClose && onClose(content);
  }

  const handleSubmit = async () => {
    if (data !== undefined) {
      let response: Response | undefined = undefined;
      if (where === undefined) {
        setLoading(true);
        response = await createManifest(data, carrierValue);
      } else if (where === "customer") {
        setLoading(true);
        response = await updateCustomerManifest(data);
      } else {
        setLoading(true);
        response = await updateSupplierManifest(data);
      }

      if (response !== undefined && response.status >= 200 && response.status <= 299 && response.data.errors.length === 0) {
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
        } else if (response.data.manifest_paid.length === 0) {
          message = intl.formatMessage({ id: "update_supplier_manifest_sucessfully" }, { manifest_paid_count: response.data.manifest_paid_count });
          showMsg(message, { type: "success" });
          confirm();
        } else if (where === "supplier" && response.data.manifest_paid.length > 0) {
          closeManifestDialog(response.data.manifest_paid);
        }
      } else if (response !== undefined && (response.status === 0 || response.status === 0)) {
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
              <div className='upload-evidence-body-dialog scrollable-hidden mt-10 mb-10'>
                {
                  where === undefined ?
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
                  disabled={carrierValue === "" && where === undefined || data === undefined}
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

export default ImportManifestDialog;