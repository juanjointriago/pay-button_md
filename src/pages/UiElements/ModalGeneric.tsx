import { FC, ReactElement, useEffect } from "react"

interface Props {
    isVisible: boolean
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
    title?: string
    children?: ReactElement
}
const Nothing = () => {
    return <div>No Content</div>
}
export const ModalGeneric: FC<Props> = ({ isVisible, setIsVisible, title = 'Modal Title', children = <Nothing /> }) => {

    useEffect(() => {
        const close = (e: KeyboardEvent) => {
            if(e.key === 'Escape'){
                setIsVisible(false);
            }
        }
        window.addEventListener('keydown', close)
        return ()=> window.removeEventListener('keydown', close)
        
    }, [])
    

    return (
        <>
            {isVisible ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-visible flex-wrap fixed inset-0 z-50 outline-none focus:outline-none  w-full">
                        <div className="relative">
                            {/*content*/}
                            <div className=" border-0 rounded-lg shadow-lg relative flex flex-col w-[40rem] h-[40rem] bg-white outline-none focus:outline-none ">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                    <h3 className="text-3xl font-semibold mr-5">
                                        {title}
                                    </h3>
                                    <button
                                        className="p-1 ml-auto bg-blue-700 border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={() => setIsVisible(false)}
                                    >
                                        <span className="bg-transparent text-white h-8 w-8 text-2xl block outline-none focus:outline-none">
                                            ×
                                        </span>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="p-6">
                                    {children}
                                </div>
                                {/*footer*/}

                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    )
}
