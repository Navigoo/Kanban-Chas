// Importerar React Hooken useState för att hantera komponentens tillstånd (state)
import { useState } from 'react';

// Importerar drag-and-drop-kontroll från biblioteket @dnd-kit/core
import { DndContext, DragOverlay } from '@dnd-kit/core';

// Importerar en egen komponent som representerar varje kolumn (t.ex. "Todo", "Doing", "Done")
import Column from './components/Column';

// Importerar en lista med initiala todo-uppgifter
import { initialTodos } from './data/data';


const App = () => {
  // Skapar ett tillstånd (state) som håller alla uppgifter (todos) i appen.
  // Börjar med en fördefinierad lista från initialTodos
  const [todos, setTodos] = useState(initialTodos);

  // Skapar ett tillstånd för att hålla reda på vilken todo som just nu dras
  const [activeId, setActiveId] = useState(null);

  // Funktion som anropas när användaren vill lägga till en ny todo
  const handleAdd = (text) => {
    // Uppdaterar listan genom att kopiera tidigare todos och lägga till en ny
    setTodos([
      ...todos, // Behåll alla tidigare todos
      {
        id: Date.now().toString(), // Unikt id baserat på tidsstämpel
        text,                      // Texten som användaren skrev in
        status: 'todo'            // Ny todo hamnar alltid i "todo"-kolumnen
      }
    ]);
  };

  // Funktion som tar bort en todo utifrån dess id
  const handleDelete = (id) => {
    // Filtrerar bort det todo-objekt som har det id som ska tas bort
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // Anropas när användaren börjar dra en todo
  const handleDragStart = (event) => {
    // Sparar id:t på det objekt som dras, så att vi kan visa det i DragOverlay
    setActiveId(event.active.id);
  };

  // Anropas när användaren släpper en todo i en kolumn
  const handleDragEnd = (event) => {
    const { active, over } = event; // Hämtar objektet som drogs och det som det släpptes över

    // Nollställer vilket objekt som är aktivt (släppt nu, så inget aktivt längre)
    setActiveId(null);

    // Om användaren inte släppte något över en kolumn, eller släppte på samma plats → gör inget
    if (!over || active.id === over.id) return;

    // Annars: Uppdatera todo:s status till den nya kolumnens id
    setTodos(prev =>
      prev.map(todo =>
        todo.id === active.id
          ? { ...todo, status: over.id } // Nytt objekt med uppdaterad status
          : todo                         // Alla andra todos förblir oförändrade
      )
    );
  };

  return (
    // Wrapper-komponent från dnd-kit som möjliggör drag-och-släpp
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="board">
        {/* Skapar en kolumn för varje status: "todo", "doing", "done" */}
        {['todo', 'doing', 'done'].map(status => (
          <Column
            key={status}                            // Nyckel krävs för att React ska hantera DOM effektivt
            id={status}                             // Unikt id för varje kolumn (används för att flytta todos)
            title={status.toUpperCase()}            // Visar rubriken i versaler
            items={todos.filter(todo => todo.status === status)} // Visar bara de todos som hör till kolumnen
            onAdd={status === 'todo' ? handleAdd : undefined}     // Endast "todo"-kolumnen har knappen "lägg till"
            onDelete={handleDelete}                 // Skickar med funktion för att radera todo
            activeId={activeId}                     // Id på todo som just nu dras (används för styling)
          />
        ))}
      </div>

      {/* Overlay-komponent som visar det kort som dras ovanpå allt annat */}
      <DragOverlay>
        {/* Om ett aktivt id finns (något dras just nu) */}
        {activeId ? (
          <div className="card dragging">
            {/* Hämta texten för den todo som dras och visa den */}
            {todos.find(todo => todo.id === activeId)?.text}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default App;
