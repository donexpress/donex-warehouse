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
                <div className="confirmation_card_header">
                    {intl.formatMessage({ id: "confirmation_header" })}
                </div>
                <div className="confirmation_card_body">
                    {intl.formatMessage({ id: "confirmation_text" })}
                </div>
                <div className="confirmation_card_actions">
                    <button className='accent_button' onClick={confirm}>
                        {intl.formatMessage({ id: 'confirmation_header' })}
                    </button>
                    <button className='cancel_button' style={{marginLeft: '10px'}} onClick={close}>
                        {intl.formatMessage({ id: 'cancel' })}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationDialog;