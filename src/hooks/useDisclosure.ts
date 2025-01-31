import React from 'react'

export const useDisclosure = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const onClose = () => setIsOpen(false)
  const onOpen = () => setIsOpen(true)
  const toggle = (isOpen?: boolean) => setIsOpen(prev => isOpen === undefined ? !prev : isOpen)
  return { isOpen, onClose, onOpen, toggle }
}
