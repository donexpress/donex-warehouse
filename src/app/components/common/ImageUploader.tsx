import React, { useRef, ChangeEvent, useState, ReactNode } from 'react';
import { uploadFile } from '../../../services/api.file';
import { Response, File as FileObj } from '../../../types'
import { showMsg} from '../../../helpers';
import { useIntl } from 'react-intl';
import '../../../styles/image-uploader.scss';

interface ImageUploaderProps {
  children: ReactNode;
  onImageUpload: (filePath: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> =  ({ children, onImageUpload }) => {
  const [sendRequest, setSendRequest] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const intl = useIntl();

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async(e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('data', file);
      setSendRequest(true);
      const response: Response = await uploadFile(formData);
      setSendRequest(false);

      if (response.status >= 200 && response.status <= 299) {
        const responseUI: FileObj = response.data;
        onImageUpload(responseUI.url);
      } else {
        let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
        showMsg(message, { type: "error" });
      }
    }
  };

  return (
    <div className='container-upload-button'>
      {sendRequest &&
        <div className='block-element elements-center'></div>
      }
      <div onClick={handleImageClick}>
        {children}
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUploader;