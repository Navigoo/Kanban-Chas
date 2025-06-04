import { useDraggable } from '@dnd-kit/core';

// TodoCard är ett kort med text + delete-knapp
const TodoCard = ({ todo, onDelete }) => {
    // Gör kortet dragbart
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: todo.id,
        data: { type: 'todo' } // Extra data man kan använda (t.ex. typ av objekt)
    });

    return (
        // Kortets wrapper, kopplad till dragbar referens
        <div className="card" ref={setNodeRef}>
            {/* Drag-handle: det område man drar i */}
            <span className="drag-handle" {...listeners} {...attributes}>
                {todo.text}
            </span>

            {/* Radera-knapp */}
            <button
                className="delete-btn"
                onClick={(e) => {
                    e.stopPropagation(); // Stoppar eventet från att bubbla upp
                    e.preventDefault(); // Förhindrar standardbeteende
                    onDelete(todo.id); // Kör delete-funktionen
                }}
            >
                ✕
            </button>
        </div>
    );
};

export default TodoCard;
