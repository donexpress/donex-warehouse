import React, { useRef, ChangeEvent, useState, ReactNode } from "react";
import { showMsg } from "../../../helpers";
import { useIntl } from "react-intl";
import "../../../styles/image-uploader.scss";
import SpinnerIconButton from "./SpinnerIconButton";
import { read, utils } from 'xlsx';

interface FileUploaderProps {
  children: ReactNode;
  onDataUpload: (data: any[]) => void;
  isXLSX?: boolean;
  isImage?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  children,
  onDataUpload,
  isXLSX,
  isImage
}) => {
  const [sendRequest, setSendRequest] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const intl = useIntl();

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    const file = e.target.files && e.target.files[0];
    if (file) {
        if (isXLSX) {
            if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
                let message = intl.formatMessage({ id: "invalid_extension_xls" });
                showMsg(message, { type: "error" });
            } else {
                const reader = new FileReader();
                reader.onload = (fl) => {
                    try {
                      const result = fl.target?.result;
                      if (result instanceof ArrayBuffer) {
                        const data = new Uint8Array(result);
                        const workbook = read(data, { type: 'array' });
                        const sheetName = workbook.SheetNames[0];
                        const sheet = workbook.Sheets[sheetName];
                        const json: any[] = utils.sheet_to_json(sheet);
    
                        onDataUpload(json);
                        setLoading(false);
                      } else {
                        let message = intl.formatMessage({ id: "error_processing_excel_file" });
                        showMsg(message, { type: "error" });
                        setLoading(false);
                      }
                    } catch (err) {console.log(err)
                        let message = intl.formatMessage({ id: "error_processing_excel_file" });
                        showMsg(message, { type: "error" });
                        setLoading(false);
                    }
                };
              
                reader.readAsArrayBuffer(file);
            }
        }
    } else {
        setLoading(false);
    }
  };

  return (
    <div className="container-upload-button">
      {sendRequest && <div className="block-element elements-center"></div>}
      <div onClick={handleFileClick}>
        {loading && (
          <div className="upload_button" style={{display: 'flex', justifyContent: 'center', alignItems: "center", paddingBottom: '8px'}}>
            <SpinnerIconButton style={{width: "20px", height: "20px"}}/>
          </div>
        )}
        {!loading && <>{children}</>}
      </div>
      <input
        type="file"
        accept={isXLSX ? ".xls, .xlsx" : (isImage ? "image/*": "")}
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUploader;