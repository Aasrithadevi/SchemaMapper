// src/components/FieldNode.js
import React from 'react';

const FieldNode = ({ field }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{field.name}</span>
    <span style={{ fontSize: '12px', color: '#666' }}>{field.type}</span>
  </div>
);

export default FieldNode;
