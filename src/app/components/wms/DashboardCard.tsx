import { FaExpandAlt } from "react-icons/fa";

interface Props {
    ammount: number;
    text: string;
    Icon: any;
    url: string
}

const DashboardCard = ({ ammount, Icon, text, url }: Props) => {
    return (
        <div className="dashboard_card">
            <div className="dashboard_card_header">
                <div style={{display: 'flex', alignItems: 'center',  gridColumnGap: '4px'}}>
                    <Icon />
                    <span style={{marginLeft: '5px'}}>{text}</span>
                </div>
                <a href={url}><FaExpandAlt /></a>
            </div>
            <div className="dashboard_card_body">
                {ammount}
            </div>
        </div>
    )
}

export default DashboardCard