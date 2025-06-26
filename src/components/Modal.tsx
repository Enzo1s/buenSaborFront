import { Dialog, DialogTitle } from '@mui/material'
import  { ReactNode } from 'react'

export interface SimpleDialogProps {
    open: boolean;
    title: string,
    onClose: (value: string) => void;
    children: ReactNode;
  }

const Modal = (props: SimpleDialogProps) => {
    const { onClose, open, title, children } = props;
  return (
    <Dialog onClose={onClose} open={open}>
    <DialogTitle>{title}</DialogTitle>
    {children}
  </Dialog>
  )
}

export default Modal