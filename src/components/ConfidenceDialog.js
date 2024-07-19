// src/components/ConfidenceDialog.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, Button } from '@mui/material';

const ConfidenceDialog = ({ open, onClose, handleConfidenceSelect }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle>Select Confidence Level</DialogTitle>
    <DialogContent>
      <Button variant="contained" color="success" onClick={() => handleConfidenceSelect('high')} sx={{ m: 1 }}>High</Button>
      <Button variant="contained" color="warning" onClick={() => handleConfidenceSelect('medium')} sx={{ m: 1 }}>Medium</Button>
      <Button variant="contained" color="error" onClick={() => handleConfidenceSelect('low')} sx={{ m: 1 }}>Low</Button>
    </DialogContent>
  </Dialog>
);

export default ConfidenceDialog;
