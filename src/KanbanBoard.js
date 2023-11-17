import React from 'react';
import TicketColumn from './TicketColumn';

function KanbanBoard({ groupedAndSortedTickets, users }) {
  return (
    <div className="kanban-board">
      {/* Render TicketColumn components based on the grouped and sorted tickets */}
      {groupedAndSortedTickets.map((column) => (
        <TicketColumn
          key={column.title}
          title={column.title}
          tickets={column.tickets}
          users={users}
        />
      ))}
    </div>
  );
}

export default KanbanBoard;
