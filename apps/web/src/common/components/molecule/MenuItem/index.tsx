import { Link } from 'react-router-dom'

interface MenuItemProps {
    label: string
    to: string
}

const MenuItem: React.FC<MenuItemProps> = ({ to, label }) => {
    return (
        <Link to={to} className="text-white px-4 hover:bg-slate-800 transition-all font-bold">
            {label}
        </Link>
    )
}

export default MenuItem
