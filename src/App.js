import React, { useState, useEffect } from 'react';
import KanbanBoard from './KanbanBoard';
import './App.css';

function App() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupingOption, setGroupingOption] = useState('status'); // default grouping option
  const [orderBy, setOrderBy] = useState('priority'); // default sorting option

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        const data = await response.json();
        setTickets(data.tickets);
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Function to filter tickets based on status
  const filterTicketsByStatus = (status) => {
    return tickets.filter((ticket) => ticket.status === status);
  };

  // Function to group and sort tickets based on user input
  const groupAndSortTickets = () => {
    let groupedAndSortedTickets = [];

    switch (groupingOption) {
      case 'status':
        // Group tickets by status
        const uniqueStatuses = [...new Set(tickets.map((ticket) => ticket.status))];
        groupedAndSortedTickets = uniqueStatuses.map((status) => {
          return {
            title: status,
            tickets: orderBy === 'priority'
              ? filterTicketsByStatus(status).sort((a, b) => b.priority - a.priority)
              : filterTicketsByStatus(status).sort((a, b) => a.title.localeCompare(b.title)),
          };
        });
        break;

      case 'user':
        // Group tickets by user
        const uniqueUsers = [...new Set(tickets.map((ticket) => ticket.userId))];
        groupedAndSortedTickets = uniqueUsers.map((userId) => {
          const user = users.find((u) => u.id === userId);
          return {
            title: user ? user.name : 'Unknown User',
            tickets: orderBy === 'priority'
              ? tickets.filter((ticket) => ticket.userId === userId).sort((a, b) => b.priority - a.priority)
              : tickets.filter((ticket) => ticket.userId === userId).sort((a, b) => a.title.localeCompare(b.title)),
          };
        });
        break;

      case 'priority':
        // Group tickets by priority
        const uniquePriorities = [...new Set(tickets.map((ticket) => ticket.priority))];
        groupedAndSortedTickets = uniquePriorities.map((priority) => {
          return {
            title: `Priority ${priority}`,
            tickets: orderBy === 'priority'
              ? tickets.filter((ticket) => ticket.priority === priority).sort((a, b) => b.priority - a.priority)
              : tickets.filter((ticket) => ticket.priority === priority).sort((a, b) => a.title.localeCompare(b.title)),
          };
        });
        break;

      default:
        break;
    }

    return groupedAndSortedTickets;
  };

  return (
    <div className="app">
      <h1>Kanban Board</h1>
      <div className="controls">
        <label>
          Group By:
          <select
            value={groupingOption}
            onChange={(e) => setGroupingOption(e.target.value)}
          >
            <option value="status">Status</option>
            <option value="user">User</option>
            <option value="priority">Priority</option>
          </select>
        </label>

        <label>
          Order By:
          <select
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
          >
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </label>
      </div>

      {/* Pass grouped and sorted tickets to KanbanBoard */}
      <KanbanBoard groupedAndSortedTickets={groupAndSortTickets()} users={users} />
    </div>
  );
}

export default App;
