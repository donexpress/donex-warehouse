import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useIntl } from "react-intl";
import '../../../styles/generic.dialog.scss';

interface Params {
  close: () => any;
  file: Blob;
}

const ExportBarCodeDialog = ({ close, file }: Params) => {
  const intl = useIntl();

  useEffect(() => {

  }, []);
  
  return (
    <div className="confirmation_container">
      <div className="confirmation_backdrop" onClick={close}></div>
      <div className="confirmation_card dialog-background">
        <div className="confirmation_card_header" style={{ color: 'white' }}>
            <div className="upload-evidence-header-dialog">
                <strong>{intl.formatMessage({ id: "generated_barcodes" })}</strong>
            </div>
        </div>
        <div style={{ width: '850px', maxWidth: '90vw' }}>
              <div className='flex flex-col gap-3'>
                <div className='upload-evidence-body-dialog scrollable-hidden'>
                  <div className="w-full">
                    <iframe
                      // @ts-ignore
                      src={URL.createObjectURL(file)}
                      style={{ width: '100%', minHeight: '500px' }}
                      title="PDF Viewer"
                    />
                  </div>
                </div>
                <div className="elements-row-end w-full">
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

export default ExportBarCodeDialog;