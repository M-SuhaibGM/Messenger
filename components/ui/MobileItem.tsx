import clsx from "clsx";
import Link from "next/link";

interface Props {
    href: string,
    label: string,
    icon: any,
    active?: boolean,
    onClick?: () => void
}
const MobileItem = ({ href, label, icon: Icon, active, onClick }: Props) => {

    const handleClick = () => {
        if (onClick) {
            return onClick();
        }
    }
    return (
        <Link href={href} onClick={handleClick} className={clsx("group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:bg-gray-100 hover:text-black", active && 'bg-gray-100 text-black justify-center p-4')}>
            <Icon className={`h-6 w-6 shrink-0 ${active && 'text-primary'}`} />
            <span className="sr-only">{label}</span>
        </Link>
    )
}

export default MobileItem