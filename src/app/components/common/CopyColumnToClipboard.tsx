import { FaCopy } from "react-icons/fa"

interface Props {
    value: any
}
const CopyColumnToClipboard = ({ value }: Props) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(value)
    }
    return (
        <div className="copy-container">
            <span>{value}</span>
            <button onClick={handleCopy}><FaCopy /></button>
        </div>
    )
}

export default CopyColumnToClipboard