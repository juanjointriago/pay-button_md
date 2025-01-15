import { FC } from "react"

interface Props{
    title?:string
    message?:string
}
export const Message:FC<Props> = ({message, title}) => {
  const now = new Date();

  return (
    <div className="no-scrollbar max-h-full space-y-3.5 overflow-auto px-6 py-7.5">
              <div className="max-w-125">
                <p className="mb-2.5 text-sm font-medium">{title??"no title"}</p>
                <div className="mb-2.5 rounded-2xl rounded-tl-none bg-gray py-3 px-5 dark:bg-boxdark-2">
                  <p>
                    {message??"No message"}
                  </p>
                </div>
                <p className="text-xs">{now.toString()}</p>
              </div>
            </div>
  )
}
