import React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import Container from './example';

export default () => {
  return (
    <DndProvider backend={Backend}>
      <Container />
    </DndProvider>
  );
};
