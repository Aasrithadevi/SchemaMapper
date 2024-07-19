// src/components/MappingDialog.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, Typography } from '@mui/material';

const MappingDialog = ({ open, onClose, recentChange, getDifferences, getFieldNameById, handleConfirm }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>Confirm Mapping Changes</DialogTitle>
    <DialogContent>
      <Typography variant="h6">Most Recent Change:</Typography>
      {recentChange ? (
        <ListItem>
          <ListItemText primary={`Change: ${recentChange.source} → ${recentChange.target} (Confidence: ${recentChange.confidenceLevel})`} />
        </ListItem>
      ) : (
        <Typography>No recent changes.</Typography>
      )}
      <Typography variant="h6" sx={{ mt: 2 }}>All Changes Made by User:</Typography>
      <List>
        {getDifferences().map((edge, index) => (
          <ListItem key={index}>
            <ListItemText primary={`Mapping: ${getFieldNameById(edge.source)} → ${getFieldNameById(edge.target)} (Confidence: ${edge.style.stroke === '#4CAF50' ? 'high' : edge.style.stroke === '#FFA500' ? 'medium' : 'low'})`} />
          </ListItem>
        ))}
      </List>
      {getDifferences().length === 0 && <Typography>No changes have been made to the mapping.</Typography>}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">Cancel</Button>
      <Button onClick={handleConfirm} variant="contained" color="primary">Confirm</Button>
    </DialogActions>
  </Dialog>
);

export default MappingDialog;
