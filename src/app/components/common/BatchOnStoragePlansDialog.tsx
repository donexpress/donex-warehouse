import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useIntl } from "react-intl";
import { BatchStoragePlans, BatchStoragePlansInput, Response } from '../../../types';
import '../../../styles/generic.dialog.scss';
import FileUploader from './FileUploader';
import { FaFileExcel, FaFileDownload } from 'react-icons/fa';
import { showMsg, downloadTemplateSP, isOMS } from "../../../helpers";
import { createBatchStoragePlan } from "../../../services/api.storage_plan";

interface Params {
  close: () => any;
  confirm: () => any;
  title: string;
}

const BatchOnStoragePlansDialog = ({ close, confirm, title }: Params) => {
  const intl = useIntl();
  const [batch, setBatch] = useState<BatchStoragePlans[]>([]);
  const [sendRequest, setSendRequest] = useState<boolean>(false);

  useEffect(() => {

  }, []);

  const handleSubmit = async() => {
    setSendRequest(true);
    const response: Response = await createBatchStoragePlan(batch);
    setSendRequest(false);

    if (response.status >= 200 && response.status <= 299) {
      let message = intl.formatMessage({ id: "successfullyActionMsg" });
      showMsg(message, { type: "success" });
      confirm();
    } else {
      let message = intl.formatMessage({ id: "unknownStatusErrorMsg" });
      showMsg(message, { type: "error" });
    }
  }

  const isBatchStoragePlans = (obj: any): boolean => {
    const keys = Object.keys(obj);
    const requiredKeys = [ 
        "customer_order_number", 
        //"username", 
        "warehouse_code", 
        //"reference_number", 
        //"bl_number", 
        "box_amount", 
        //"delivered_time", 
        //"observations", 
        //"return", 
        //"rejected_boxes", 
        //"digits_box_number" 
    ];
    
    return requiredKeys.every(key => keys.includes(key));
  }

  const uploadBatch = (b: BatchStoragePlansInput[]) => {
    if (b.every(isBatchStoragePlans)) {
        setBatch(b.map((item: any) => {
            return {
              return: Boolean(item.return && item.return.toString().toLowerCase() === 'true'), 
              rejected_boxes: Boolean(item.rejected_boxes && item.rejected_boxes.toString().toLowerCase() === 'true'),
              reference_number: item.reference_number ? item.reference_number : '',
              pr_number: item.bl_number ? item.bl_number : '',
              delivered_time: item.delivered_time ? item.delivered_time : null,
              observations: item.observations ? item.observations : '',
              expansion_box_number: item.customer_order_number,
              digits_box_number: item.digits_box_number ? Number(item.digits_box_number) : null,
              customer_order_number: item.customer_order_number,
              warehouse_code: item.warehouse_code,
              box_amount: Number(item.box_amount),
              username: (item.username && !isOMS()) ? item.username : null,
            };
        }));
    } else {
        if (b.length === 0) {
            let message = intl.formatMessage({ id: "empty_excel" });
            showMsg(message, { type: "info" });
        } else {
            let message = intl.formatMessage({ id: "excel_format_is_not_correct" });
            showMsg(message, { type: "error" });
        }
        setBatch([]);
    }
  }
  
  return (
    <div className="confirmation_container">
      <div className="confirmation_backdrop" onClick={close}></div>
      <div className="confirmation_card dialog-background">
        <div className="confirmation_card_header" style={{ color: 'white' }}>
            <div className="upload-batch-sp-header-dialog">
                <strong>{ title }</strong>
                <div
                  className="upload_button_evidence"
                  onClick={() => { downloadTemplateSP() }}
                >
                    <span>
                      {intl.formatMessage({ id: "template" })}
                    </span>
                    <FaFileDownload style={{fontSize: '16px', color: 'white' }} />
                </div>
                <FileUploader onDataUpload={uploadBatch} isXLSX={true}>
                  <div
                    className="upload_button_evidence"
                  >
                      <span>
                        {intl.formatMessage({ id: "upload" })}
                      </span>
                      <FaFileExcel style={{fontSize: '16px', color: 'white' }} />
                  </div>
                </FileUploader>
            </div>
        </div>
        <div style={{ width: '500px', maxWidth: '90vw' }}>
              <div className='flex flex-col gap-3'>
                <div className='upload-evidence-body-dialog scrollable-hidden'>
                    {
                        <div className="elements-center w-full" style={{ height: '80px' }}>
                            {
                                batch.length === 0 && (
                                    <span>{intl.formatMessage({ id: "please_upload_excel" })}</span>
                                )
                            }
                            {
                                batch.length === 1 && (
                                    <span>{intl.formatMessage({ id: "available_item_to_be_imported" }, { in: batch.length })}</span>
                                )
                            }
                            {
                                batch.length > 1 && (
                                    <span>{intl.formatMessage({ id: "available_items_to_be_imported" }, { in: batch.length })}</span>
                                )
                            }
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
                    disabled={batch.length === 0 || sendRequest}
                  >
                    {intl.formatMessage({ id: "confirmation_header" })}
                  </Button>
                  <Button onClick={close} type="button" className="bg-secundary px-4">
                    {intl.formatMessage({ id: "cancel" })}
                  </Button>
                </div>
              </div>
        </div>
      </div>
    </div>
  );
};

export default BatchOnStoragePlansDialog;