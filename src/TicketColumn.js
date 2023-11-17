import React from 'react';
import TicketCard from './TicketCard';

const TicketColumn = ({ title, tickets, sortingOption }) => {
  return (
    <div className="ticket-column">
      <h2>{title}</h2>
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
};

export default TicketColumn;
