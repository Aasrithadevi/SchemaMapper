# SchemaMapper
- React and Material UI

- This project is a React-based AutoMapping Tool that facilitates mapping fields between source and target schemas with different confidence levels.

## Features

- **Dynamic Field Mapping:** Allows users to map fields between source and target schemas.
- **Confidence Levels:** Users can set confidence levels (High, Medium, Low) for each mapping.
- **User Interaction:** Users can confirm, reset, and filter mappings based on confidence levels.
- **Visual Representation:** Provides a visual representation of the mapping process using ReactFlow.

## Requirements

- Node.js
- npm (Node Package Manager)

## Files

- `AutoMappingUI.js`: Main component for the AutoMapping UI.
- `ConfidenceDialog.js`: Component for selecting confidence levels.
- `FieldNode.js`: Component to display a field node.
- `MappingDialog.js`: Component to confirm mapping changes.
- `fields.js`: Contains source and target field data.
- `initialMappings.js`: Contains initial mapping data.

## How to Install and Run

1. **Install Dependencies:**

    ```sh
    npm install
    ```

2. **Run the Application:**

    ```sh
    npm start
    ```

    The application will start on `http://localhost:3000`.

## Example Usage

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import AutoMappingUI from './AutoMappingUI';

ReactDOM.render(<AutoMappingUI />, document.getElementById('root'));
