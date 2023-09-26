import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useIntl } from "react-intl";
import { StoragePlan } from '../../../types/storage_plan';
import { CameraIcon } from './CameraIcon';
import '../../../styles/generic.dialog.scss';
import ImageUploader from './ImageUploader';
import { FaTrash } from 'react-icons/fa';

interface Params {
  close: () => any;
  confirm: (images: string[]) => any;
  title: string;
  storagePlan: StoragePlan;
}

const UploadEvidenceDialog = ({ close, confirm, title, storagePlan }: Params) => {
  const intl = useIntl();
  const [images, setImages] = useState<string[]>(storagePlan.images ? storagePlan.images : []);

  useEffect(() => {

  }, []);

  const handleSubmit = async() => {
      confirm(images);
  }

  const areEqual = (): boolean => {
      return JSON.stringify(storagePlan.images ? storagePlan.images : []) === JSON.stringify(images);
  }

  const uploadImageClient = (imagePath: string) => {
    setImages(images.concat([imagePath]));
  }

  const delImageClient = (imagePath: string) => {
    setImages(images.filter((image: string) => image !== imagePath));
  }
  
  return (
    <div className="confirmation_container">
      <div className="confirmation_backdrop" onClick={close}></div>
      <div className="confirmation_card dialog-background">
        <div className="confirmation_card_header" style={{ color: 'white' }}>
            <div className="upload-evidence-header-dialog">
                <strong>{ title }</strong>
                
                <ImageUploader onImageUpload={uploadImageClient}>
                  <div
                    className="upload_button_evidence"
                  >
                      <span>
                        {intl.formatMessage({ id: "upload" })}
                      </span>
                      <CameraIcon />
                  </div>
                </ImageUploader>
            </div>
        </div>
        <div style={{ width: '500px', maxWidth: '90vw' }}>
              <div className='flex flex-col gap-3'>
                <div className='upload-evidence-body-dialog scrollable-hidden'>
                    {
                        images.length === 0 && (
                            <div className="elements-center w-full" style={{ height: '80px' }}>
                                <span>{intl.formatMessage({ id: "no_images" })}</span>
                            </div>
                        )
                    }
                    {
                        images.length !== 0 && (
                            <div className="w-full">
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                                    {
                                        images.map((image: string, index: number) => (
                                            <div key={index} style={{ width: '80px', height: '110px' }} className="container-evidence">
                                                <div style={{ width: '80px', height: '80px' }} className="elements-center">
                                                    <img
                                                      src={image}
                                                      alt=''
                                                      style={{ maxWidth: '80px', maxHeight: '80px', borderRadius: '4px' }}
                                                    />
                                                </div>
                                                <div className="del-evidence-img elements-center">
                                                    <FaTrash color="white" size={18} style={{ cursor: 'pointer' }} onClick={() => { delImageClient(image) }}/>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="elements-row-end w-full">
                  <Button
                    color="primary"
                    type="submit"
                    className="px-4"
                    style={{ marginRight: '15px' }}
                    onClick={handleSubmit}
                    isDisabled={areEqual()}
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

export default UploadEvidenceDialog;