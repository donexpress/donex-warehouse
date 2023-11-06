import { showMsg } from "@/helperserege1992";
import { FaCopy } from "react-icons/fa"
import { useIntl } from "react-intl";

interface Props {
    value: any
}
const CopyColumnToClipboard = ({ value }: Props) => {
    const intl = useIntl();

    const handleCopy = () => {
        if (typeof value === "string") {
            navigator.clipboard.writeText(value.toString());
        } else {
            navigator.clipboard.writeText(value.props.children)
        }
        const message = intl.formatMessage({ id: "copied_item" });
        showMsg(message, { type: "success" });
    }
    return (
        <div className="copy-container">
            <span>{value}</span>
            <button onClick={handleCopy}><FaCopy /></button>
        </div>
    )
}

export default CopyColumnToClipboard