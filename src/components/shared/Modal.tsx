
interface ModalProps {
  children: React.ReactNode;
  open: boolean;
  closeOnBlur?: boolean;
  onToggleModal: (isOpen: boolean) => void;
}

export const Modal = ({ onToggleModal, open, children, closeOnBlur = true }: ModalProps) => {
  return (
    <div>
      {/* <button
        ref={trigger}
        onClick={() => setModalOpen(!modalOpen)}
        className="rounded-md bg-primary px-9 py-3 font-medium text-white hover:bg-opacity-90"
      >
        Modal 1
      </button> */}
      <div
        className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-2 py-4 ${open ? 'block' : 'hidden'
          }`}
      >
        <div
          // ref={modal}
          onFocus={() => onToggleModal(true)}
          onBlur={() => closeOnBlur && onToggleModal(false)}
          className="w-full max-w-142.5 rounded-lg bg-white px-2 py-4 text-center dark:bg-boxdark"
        >
          {/* <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
            Your Message Sent Successfully
          </h3> */}
          {/* <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
          <p className="mb-10">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since
          </p> */}
          {children}
          {/* <div className="-mx-3 flex flex-wrap gap-y-4">
            <div className="2xsm:w-1/2 w-full px-3">
              <button
                onClick={() => onToggleModal(false)}
                className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
              >
                Cancel
              </button>
            </div>

            <div className="2xsm:w-1/2 w-full px-3">
              <button className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90">
                View Details
              </button>
            </div>
          </div> */}

        </div>
      </div>
    </div>
  )
};
