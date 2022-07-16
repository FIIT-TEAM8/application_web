import { Snackbar, Alert } from '@mui/material';

export default function SuccessSnackbar({ text, open, handleClose }) {
    return (
        <Snackbar
            open={open}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={handleClose}
            autoHideDuration={3000}
        >
            <Alert
                onClose={handleClose}
                severity="success"
                sx={{ width: '100%' }}
            >
                {text}
            </Alert>
        </Snackbar>
    );
}