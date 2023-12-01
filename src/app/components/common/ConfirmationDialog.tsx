import { Button } from "@nextui-org/react";
import { useIntl } from "react-intl";
import { Loading } from "./Loading";

interface Params {
  close: () => any;
  confirm: () => any;
  loading?: boolean;
  content?: string;
}

const ConfirmationDialog = ({ close, confirm, loading, content }: Params) => {
  const intl = useIntl();
  
  return (
    <div className="confirmation_container">
      <div className="confirmation_backdrop" onClick={close}></div>
      <div className={loading ? "confirmation_card dialog-background" : "confirmation_card"} style={{ width: content ? '245px': 'auto' }}>
        <Loading loading={ loading } content={intl.formatMessage({ id: "processing" })}>
        <div className="confirmation_card_header black-label">
          <strong>{intl.formatMessage({ id: "confirmation_header" })}</strong>
        </div>
        <div className="flex justify-center my-4  black-label">
          { content ? content : intl.formatMessage({ id: "confirmation_text" })}
        </div>
        <div className="flex justify-between gap-3">
          <Button
            color="primary"
            type="button"
            className="px-4"
            onClick={confirm}
          >
            {intl.formatMessage({ id: "confirmation_header" })}
          </Button>
          <Button onClick={close} type="button" className="bg-secundary px-4">
            {intl.formatMessage({ id: "cancel" })}
          </Button>
        </div>
        </Loading>
      </div>
    </div>
  );
};

export default ConfirmationDialog;