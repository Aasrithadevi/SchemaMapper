// src/AutoMappingUI.js
import React, { useState, useCallback, memo } from 'react';
import { createTheme, ThemeProvider, CssBaseline, Container, Box, Typography, Button, Select, MenuItem, AppBar, Toolbar, IconButton, useMediaQuery, Alert } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ReactFlow, { MarkerType, addEdge, applyEdgeChanges } from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';
import FieldNode from './components/FieldNode';
import MappingDialog from './components/MappingDialog';
import ConfidenceDialog from './components/ConfidenceDialog';
import { sourceFields, targetFields } from './data/fields';
import { initialMappings } from './data/initialMappings';

// Theme configuration
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#1976d2' },
    background: { default: '#f5f5f5', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500, marginBottom: '10px' },
  },
  components: {
    MuiCard: { styleOverrides: { root: { boxShadow: '0 4px 6px rgba(0,0,0,0.1)' } } },
    MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
  },
});

const getColorByConfidenceLevel = (confidenceLevel) => {
  switch (confidenceLevel) {
    case "high":
      return '#4CAF50';
    case "medium":
      return '#FFA500';
    case "low":
      return '#FF0000';
    default:
      return '#000000';
  }
};

const ResponsiveContainer = ({ children }) => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Container maxWidth={isSmallScreen ? "sm" : "xl"} sx={{ mt: 4, mb: 4 }}>
      {children}
    </Container>
  );
};

const AutoMappingUI = () => {
  const [nodes, setNodes] = useState([
    ...sourceFields.map((field, index) => ({
      id: field.id,
      position: { x: 50, y: 50 + index * 40 },
      data: { label: <FieldNode field={field} /> },
      type: 'input',
      sourcePosition: 'right',
      style: { padding: '5px 10px', border: 'none', backgroundColor: 'transparent', width: 280, textAlign: 'left' },
    })),
    ...targetFields.map((field, index) => ({
      id: field.id,
      position: { x: 550, y: 50 + index * 40 },
      data: { label: <FieldNode field={field} /> },
      type: 'output',
      targetPosition: 'left',
      style: { padding: '5px 10px', border: 'none', backgroundColor: 'transparent', width: 280, textAlign: 'left' },
    })),
  ]);

  const [edges, setEdges] = useState(initialMappings.map(mapping => ({
    id: mapping.id,
    source: mapping.source,
    target: mapping.target,
    type: 'default',
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: getColorByConfidenceLevel(mapping.confidenceLevel) },
    style: { stroke: getColorByConfidenceLevel(mapping.confidenceLevel), strokeWidth: 2, strokeDasharray: mapping.confirmed ? '0' : '5,5' }
  })));

  const [userChanges, setUserChanges] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [filter, setFilter] = useState('all');
  const [openConfidenceDialog, setOpenConfidenceDialog] = useState(false);
  const [newEdgeParams, setNewEdgeParams] = useState(null);
  const [recentChange, setRecentChange] = useState(null);
  const [error, setError] = useState(null);

  const getFieldNameById = (id) => {
    const field = [...sourceFields, ...targetFields].find(f => f.id === id);
    return field ? field.name : id;
  };

  const onConnect = useCallback((params) => {
    setNewEdgeParams(params);
    setOpenConfidenceDialog(true);
  }, []);

  const handleConfidenceSelect = (confidenceLevel) => {
    try {
      const newEdge = { 
        id: `edge-${edges.length + 1}`,
        ...newEdgeParams, 
        animated: false, 
        markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: getColorByConfidenceLevel(confidenceLevel) },
        style: { stroke: getColorByConfidenceLevel(confidenceLevel), strokeWidth: 2, strokeDasharray: '5,5' },
        confirmed: false
      };

      setEdges((eds) => addEdge(newEdge, eds.filter(edge => edge.source !== newEdgeParams.source)));

      const change = {
        type: 'add',
        source: getFieldNameById(newEdgeParams.source),
        target: getFieldNameById(newEdgeParams.target),
        confidenceLevel: confidenceLevel
      };
      setRecentChange(change);
      setUserChanges((prevChanges) => [...prevChanges, change]);
      setOpenConfidenceDialog(false);
    } catch (err) {
      setError("Failed to add mapping. Please try again.");
    }
  };

  const onEdgesDelete = useCallback((edgesToDelete) => {
    try {
      setEdges((eds) => applyEdgeChanges(edgesToDelete.map(edge => ({ id: edge.id, type: 'remove' })), eds));
      edgesToDelete.forEach(edge => {
        const change = {
          type: 'remove',
          source: getFieldNameById(edge.source),
          target: getFieldNameById(edge.target)
        };
        setRecentChange(change);
        setUserChanges((prevChanges) => [...prevChanges, change]);
      });
    } catch (err) {
      setError("Failed to delete mapping. Please try again.");
    }
  }, []);

  const handleConfirm = () => {
    try {
      const confirmedEdges = edges.map(edge => {
        const change = userChanges.find(change => change.source === getFieldNameById(edge.source) && change.target === getFieldNameById(edge.target));
        if (change) {
          return {
            ...edge,
            style: { stroke: getColorByConfidenceLevel(change.confidenceLevel), strokeWidth: 2, strokeDasharray: '0' },
            markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: getColorByConfidenceLevel(change.confidenceLevel) },
            confirmed: true
          };
        }
        return edge;
      });

      setUserChanges([]);
      initialMappings.length = 0;
      confirmedEdges.forEach(edge => {
        const confidenceLevel = edge.style.stroke === '#4CAF50' ? 'high' : edge.style.stroke === '#FFA500' ? 'medium' : 'low';
        initialMappings.push({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          confidenceLevel: confidenceLevel,
          confirmed: true
        });
      });

      setEdges(confirmedEdges);
      setOpenConfirmDialog(false);
      handleFilterChange({ target: { value: filter } });
    } catch (err) {
      setError("Failed to confirm mapping. Please try again.");
    }
  };

  const handleReset = () => {
    setEdges(initialMappings.map(mapping => ({
      id: mapping.id,
      source: mapping.source,
      target: mapping.target,
      type: 'default',
      markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: getColorByConfidenceLevel(mapping.confidenceLevel) },
      style: { stroke: getColorByConfidenceLevel(mapping.confidenceLevel), strokeWidth: 2, strokeDasharray: mapping.confirmed ? '0' : '5,5' }
    })));
    setUserChanges([]);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    const filteredEdges = initialMappings.filter(mapping => event.target.value === 'all' || mapping.confidenceLevel === event.target.value);
    setEdges(filteredEdges.map(mapping => ({
      id: mapping.id,
      source: mapping.source,
      target: mapping.target,
      type: 'default',
      markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: getColorByConfidenceLevel(mapping.confidenceLevel) },
      style: { stroke: getColorByConfidenceLevel(mapping.confidenceLevel), strokeWidth: 2, strokeDasharray: mapping.confirmed ? '0' : '5,5' }
    })));
  };

  const getDifferences = () => {
    return edges.filter(edge => {
      const initialMapping = initialMappings.find(mapping => mapping.source === edge.source && mapping.target === edge.target);
      return !initialMapping || initialMapping.confidenceLevel !== (edge.style.stroke === '#4CAF50' ? 'high' : edge.style.stroke === '#FFA500' ? 'medium' : 'low');
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Auto-Mapping
          </Typography>
          <Button color="inherit">Profile</Button>
        </Toolbar>
      </AppBar>
      <ResponsiveContainer>
        {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Select value={filter} onChange={handleFilterChange} displayEmpty aria-label="Filter confidence level">
            <MenuItem value="all">All Confidence Levels</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={handleReset} color="primary" size="large">Reset to Default</Button>
            <Button variant="contained" onClick={() => setOpenConfirmDialog(true)} color="primary" size="large">Confirm Mapping</Button>
          </Box>
        </Box>
        <Box sx={{ height: '80vh', bgcolor: '#f0f0f0', position: 'relative', padding: '20px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Source - Customers</Typography>
            <Typography variant="h6">Target - Master Schema</Typography>
          </Box>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onConnect={onConnect}
            onEdgesDelete={onEdgesDelete}
            fitView
            nodesDraggable={false}
            panOnDrag={false}
            panOnScroll={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            className="no-background"
          />
        </Box>
      </ResponsiveContainer>
      
      <MappingDialog 
        open={openConfirmDialog} 
        onClose={() => setOpenConfirmDialog(false)} 
        recentChange={recentChange} 
        getDifferences={getDifferences} 
        getFieldNameById={getFieldNameById} 
        handleConfirm={handleConfirm}
      />

      <ConfidenceDialog 
        open={openConfidenceDialog} 
        onClose={() => setOpenConfidenceDialog(false)} 
        handleConfidenceSelect={handleConfidenceSelect}
      />

      <style>
        {`
          .react-flow__node {
            font-size: 12px;
            color: #333;
            text-align: left;
            transition: all 0.3s ease;
            padding: 5px;
            border-bottom: 1px solid #ccc;
          }
          .react-flow__node:hover {
            background-color: #f0f0f0;
          }
          .react-flow__edge-path {
            stroke-width: 2;
          }
          .react-flow__edge {
            stroke-dasharray: 5, 5;
          }
          .react-flow__handle {
            width: 6px;
            height: 6px;
            background: #fff;
            border: 2px solid #777;
          }
          .react-flow__attribution a {
            display: none;
          }
          .no-background .react-flow__background {
            display: none;
          }
        `}
      </style>
    </ThemeProvider>
  );
};

export default AutoMappingUI;
