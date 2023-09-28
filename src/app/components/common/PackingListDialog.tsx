import { Button } from "@nextui-org/react";
import { useIntl } from "react-intl";
import { PackingList } from "../../../types/storage_plan";
import '../../../styles/generic.dialog.scss';

interface Params {
  close: () => any;
  confirm: () => any;
  title: string;
  packingLists: PackingList[];
}

const PackingListDialog = ({ close, confirm, title, packingLists }: Params) => {
  const intl = useIntl();
  return (
    <div className="confirmation_container">
      <div className="confirmation_backdrop" onClick={close}></div>
      <div className="confirmation_card">
        <div className="confirmation_card_header black-label">
          <strong>{ title }</strong>
        </div>
        <div className="my-4  black-label elements-center-start upload-evidence-body-dialog" style={{ width: '308px' }}>
            {packingLists.map((pl: PackingList, index: number) => (
              <div key={index} style={{ borderTop: 'solid 1px #343B4F', borderLeft: 'solid 1px #343B4F', borderRight: 'solid 1px #343B4F', borderBottom: (index === (packingLists.length-1)) ? 'solid 1px #343B4F' : 'none', padding: '8px 10px', width: '300px', maxWidth: '90vw', textAlign: 'left' }}>
                  { pl.box_number }
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

export default PackingListDialog;