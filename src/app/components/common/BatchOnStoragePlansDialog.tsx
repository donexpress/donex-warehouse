import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useIntl } from "react-intl";
import { BatchStoragePlans, Response } from '../../../types';
import '../../../styles/generic.dialog.scss';
import FileUploader from './FileUploader';
import { FaFileExcel } from 'react-icons/fa';
import { showMsg } from "../../../helpers";
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

  const handleSubmit = async() => {console.log(batch);
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
        //"user_id", 
        "warehouse_id", 
        //"reference_number", 
        //"pr_number", 
        "box_amount", 
        //"delivered_time", 
        //"observations", 
        //"return", 
        //"rejected_boxes", 
        //"expansion_box_number", 
        //"digits_box_number" 
    ];
    
    return requiredKeys.every(key => keys.includes(key));
  }

  const uploadBatch = (b: BatchStoragePlans[]) => {
    console.log(b)
    if (b.every(isBatchStoragePlans)) {
        setBatch(b.map((item: any) => {
            return {
                ...item, 
                return: (item.return && item.return.toString().toLowerCase() === 'true'), 
                rejected_boxes: (item.rejected_boxes && item.rejected_boxes.toString().toLowerCase() === 'true'),
                user_id: item.user_id ? Number(item.user_id) : null,
                reference_number: item.reference_number ? item.reference_number : '',
                pr_number: item.pr_number ? item.pr_number : '',
                delivered_time: item.delivered_time ? item.delivered_time : null,
                observations: item.observations ? item.observations : '',
                expansion_box_number: item.expansion_box_number ? item.expansion_box_number : '',
                digits_box_number: item.digits_box_number ? Number(item.digits_box_number) : null,
            }
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
            <div className="upload-evidence-header-dialog">
                <strong>{ title }</strong>
                
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
                    isDisabled={batch.length === 0 || sendRequest}
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