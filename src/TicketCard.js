import React from 'react';

const TicketCard = ({ ticket }) => {
  return (
    <div className="ticket-card">
      <h3>{ticket.title}</h3>
      <p>Status: {ticket.status}</p>
      <p>User: {ticket.userId || 'Unassigned'}</p>
      <p>Priority: {ticket.priority}</p>
    </div>
  );
};

export default TicketCard;
