
interface ModalProps {
  children: React.ReactNode;
  open: boolean;
  closeOnBlur?: boolean;
  onToggleModal: (isOpen: boolean) => void;
  maxW?: string;
}

export const Modal = ({ onToggleModal, open, children, closeOnBlur = true, maxW = 'max-w-142.5' }: ModalProps) => {
  return (
    <div>
      {
        open &&
        <div
          className={`fixed left-0 top-0 z-9999 flex h-full min-h-screen w-full items-center justify-center px-2 py-4 ${open ? 'block' : 'hidden'}`}
        >
          <div
            onFocus={() => onToggleModal(true)}
            className={`w-full ${maxW} rounded-lg bg-white px-2 py-4 text-center dark:bg-boxdark`}
          >
            {children}
          </div>
          
          {/* overlay */}
          <div 
            className="fixed left-0 top-0 -z-1 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-2 py-4 "
            onClick={() => closeOnBlur && onToggleModal(false)}
          />
        </div>
      }
    </div>
  )
};
