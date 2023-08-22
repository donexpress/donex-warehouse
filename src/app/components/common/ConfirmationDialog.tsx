import { Button } from "@nextui-org/react";
import { useIntl } from "react-intl";

interface Params {
    close: () =>any,
    confirm: ()=>any
}

const ConfirmationDialog = ({close, confirm}: Params) => {
    const intl = useIntl();
    return (
        <div className="confirmation_container">
            <div className="confirmation_backdrop" onClick={close}></div>
            <div className="confirmation_card">
                <div className="confirmation_card_header black-label">
                    <strong>{intl.formatMessage({ id: "confirmation_header" })}</strong>
                </div>
                <div className="flex justify-center my-4  black-label">
                    {intl.formatMessage({ id: "confirmation_text" })}
                </div>
                <div className='flex justify-between gap-3'>
                    <Button color="primary" type="button" className='px-4' onClick={confirm}>
                        {intl.formatMessage({ id: 'confirmation_header' })}
                    </Button>
                    <Button onClick={close} type="button" className='bg-secundary px-4'>
                        {intl.formatMessage({ id: 'cancel' })}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationDialog;