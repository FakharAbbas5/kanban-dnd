import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { v4 as uuid } from "uuid";
import "./App.css";

const itemsFromBackend = [
  { id: uuid(), content: "Task 1" },
  { id: uuid(), content: "Task 2" },
  { id: uuid(), content: "Task 3" },
  { id: uuid(), content: "Task 4" },
  { id: uuid(), content: "Task 5" },
];

const columnsFromBackend = {
  [uuid()]: {
    name: "To Do",
    items: itemsFromBackend,
  },
  [uuid()]: {
    name: "Designing",
    items: [],
  },
  [uuid()]: {
    name: "Development",
    items: [],
  },
  [uuid()]: {
    name: "Testing",
    items: [],
  },
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  console.log(result);

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

function App() {
  const [columns, setColumns] = useState(columnsFromBackend);
  return (
    <div className='dnd'>
      <DragDropContext
        onDragEnd={result => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div className='dnd__column' key={columnId}>
              <h2>{column.name}</h2>
              <div className='dnd__column__droppable'>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "#E3F8FF"
                            : "#f3f3f3",
                        }}
                        className='dnd__column__droppable__container'
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: "none",
                                      backgroundColor: snapshot.isDragging
                                        ? "lightgray"
                                        : "#3CA9A6",
                                      ...provided.draggableProps.style,
                                    }}
                                    className='dnd__column__droppable__container__draggable'
                                  >
                                    {item.content}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
