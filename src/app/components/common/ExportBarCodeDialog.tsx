import { Button } from "@nextui-org/react";
import { useIntl } from "react-intl";
import '../../../styles/generic.dialog.scss';
import { saveAs } from 'file-saver';

interface Params {
  close: () => any;
  file: Blob;
}

const ExportBarCodeDialog = ({ close, file }: Params) => {
  const intl = useIntl();

  const downloadPdf = () => {
    const time = (new Date()).getTime();
    const blob = new Blob([file], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    saveAs(url, `plan_label_${time}.pdf`);
  }
  
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
                  <Button
                    color="primary"
                    type="submit"
                    className="px-4"
                    style={{ marginRight: '15px' }}
                    onClick={downloadPdf}
                  >
                    {intl.formatMessage({ id: "download" })}
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

export default ExportBarCodeDialog;