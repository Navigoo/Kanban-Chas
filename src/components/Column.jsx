// Importerar useState för lokal inputhantering
import { useState } from 'react';
// Importerar useDroppable för att göra kolumnen till ett droppområde
import { useDroppable } from '@dnd-kit/core';
// Importerar TodoCard-komponenten
import TodoCard from './ToDoCard';

// Column-komponenten representerar en lista (t.ex. "Todo", "Doing", "Done")
const Column = ({ id, title, items, onAdd, onDelete }) => {
  // setNodeRef behövs för att koppla droppzonen till rätt DOM-element
  const { setNodeRef } = useDroppable({ id });

  // Lokalt tillstånd för textinmatningen (ny todo)
  const [inputValue, setInputValue] = useState('');

  // Funktion som hanterar formulärets inskick
  const handleSubmit = (e) => {
    e.preventDefault(); // Förhindrar sidladdning
    if (!inputValue.trim()) return; // Undvik tomma todos
    onAdd(inputValue); // Lägg till ny todo
    setInputValue(''); // Rensa fältet
  };

  return (
    // Wrapper-div som kopplas till droppzonen
    <div className="column" ref={setNodeRef}>
      <h2>{title}</h2>

      {/* Visar inmatningsfält endast i "todo"-kolumnen */}
      {id === 'todo' && onAdd && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ny todo..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} // Uppdatera input vid varje tangenttryckning
          />
        </form>
      )}

      {/* Loopa igenom todos och rendera ett kort för varje */}
      {items.map(todo => (
        <TodoCard key={todo.id} todo={todo} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default Column;
