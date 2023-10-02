import { getLanguage } from "@/helpers/utilserege1992";
import { Button } from "@nextui-org/react";
import { useIntl } from "react-intl";

interface Params {
  close: () => any;
  confirm: () => any;
  title: string;
  texts: string[];
}

const OperationInstructionConfirmationDialog = ({
  close,
  confirm,
  title,
  texts,
}: Params) => {
  const intl = useIntl();
  return (
    <div className="confirmation_container">
      <div className="confirmation_backdrop" onClick={close}></div>
      <div className="confirmation_card">
        <div className="confirmation_card_header black-label">
          <strong>{ title }</strong>
        </div>
        <div className="flex justify-center my-4  black-label elements-center">
            {texts.map((pl: string, index: number) => (
              <div key={index} style={{ borderTop: 'solid 1px #343B4F', borderLeft: 'solid 1px #343B4F', borderRight: 'solid 1px #343B4F', borderBottom: (index === (texts.length-1)) ? 'solid 1px #343B4F' : 'none', padding: '8px 10px', width: '300px', maxWidth: '90vw', textAlign: 'left' }}>
                  {/* @ts-ignore */}
                  { pl[getLanguage(intl)] }
              </div>
            ))}
        </div>
        <div className="elements-row-end">
          <Button
            color="primary"
            type="button"
            className="px-4"
            onClick={confirm}
            style={{ marginRight: '15px' }}
          >
            {intl.formatMessage({ id: "confirmation_header" })}
          </Button>
          <Button onClick={close} type="button" className="bg-secundary px-4">
            {intl.formatMessage({ id: "cancel" })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OperationInstructionConfirmationDialog;
