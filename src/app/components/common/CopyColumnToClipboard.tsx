import { FaCopy } from "react-icons/fa"

interface Props {
    value: any
}
const CopyColumnToClipboard = ({ value }: Props) => {
    const handleCopy = () => {
        if(typeof value === "string"){
            navigator.clipboard.writeText(value.toString())            
        } else {
            navigator.clipboard.writeText(value.props.children)
        }
    }
    return (
        <div className="copy-container">
            <span>{value}</span>
            <button onClick={handleCopy}><FaCopy /></button>
        </div>
    )
}

export default CopyColumnToClipboard