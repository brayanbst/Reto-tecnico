import { Toaster } from 'react-hot-toast'

function ShellToaster() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        className: 'toast-shell',
        duration: 5000,
      }}
    />
  )
}

export default ShellToaster
