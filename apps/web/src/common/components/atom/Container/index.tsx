import { PropsWithChildren } from 'react'

interface ContainerProps {
    className?: string
}

const Container: React.FC<PropsWithChildren<ContainerProps>> = ({ children, className }) => {
    return (
        <div
            className={`m-auto sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl ${
                className || ''
            }`}
        >
            {children}
        </div>
    )
}

export default Container
