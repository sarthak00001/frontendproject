import React, { useState, useEffect } from 'react';
import KanbanBoard from './KanbanBoard';
import CircleIcon from '@mui/icons-material/FiberManualRecord'; // filled Circle
import Brightness1OutlinedIcon from '@mui/icons-material/Brightness1Outlined'; // outlined circle
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'; // three horizontal dots
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'; // plus icon
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // done
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'; // canceled
import TimelapseOutlinedIcon from '@mui/icons-material/TimelapseOutlined'; // in progress
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'; // backlog
import SignalWifi0BarIcon from '@mui/icons-material/SignalWifi0Bar'; // low - 0
import SignalWifi1BarIcon from '@mui/icons-material/SignalWifi1Bar'; // low - 1
import SignalWifi3BarIcon from '@mui/icons-material/SignalWifi3Bar'; // medium - 2
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar'; // high - 3
import SignalCellularConnectedNoInternet4BarIcon from '@mui/icons-material/SignalCellularConnectedNoInternet4Bar'; // urgent
import TuneIcon from '@mui/icons-material/Tune';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './App.css';

// The rest of your code remains unchanged

function App() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupingOption, setGroupingOption] = useState('status');
  const [orderBy, setOrderBy] = useState('priority');

  useEffect(() => {
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

  const filterTicketsByStatus = (status) => {
    return tickets.filter((ticket) => ticket.status === status);
  };

  const groupAndSortTickets = () => {
    let groupedAndSortedTickets = [];

    switch (groupingOption) {
      case 'status':
        const statusIcons = {
          done: <CheckCircleIcon />,
          canceled: <CancelOutlinedIcon />,
          inprogress: <TimelapseOutlinedIcon />,
          backlog: <HistoryOutlinedIcon />,
        };

        const uniqueStatuses = [...new Set(tickets.map((ticket) => ticket.status))];
        groupedAndSortedTickets = uniqueStatuses.map((status) => {
          return {
            title: (
              <div>
                {statusIcons[status] || <CircleIcon />} {status}
              </div>
            ),
            tickets: orderBy === 'priority'
              ? filterTicketsByStatus(status).sort((a, b) => b.priority - a.priority)
              : filterTicketsByStatus(status).sort((a, b) => a.title.localeCompare(b.title)),
          };
        });
        break;

      case 'user':
        const uniqueUsers = [...new Set(tickets.map((ticket) => ticket.userId))];
        groupedAndSortedTickets = uniqueUsers.map((userId) => {
          const user = users.find((u) => u.id === userId);
          return {
            title: (
              <div>
                <span className="user-icon">{user ? user.name[0] : '?'}</span>
                {user ? user.name : 'Unknown User'}
              </div>
            ),
            tickets: orderBy === 'priority'
              ? tickets.filter((ticket) => ticket.userId === userId).sort((a, b) => b.priority - a.priority)
              : tickets.filter((ticket) => ticket.userId === userId).sort((a, b) => a.title.localeCompare(b.title)),
          };
        });
        break;

      case 'priority':
        const priorityIcons = {
          0: <SignalWifi0BarIcon />,
          1: <SignalWifi1BarIcon />,
          2: <SignalWifi3BarIcon />,
          3: <SignalWifiStatusbar4BarIcon />,
          urgent: <SignalCellularConnectedNoInternet4BarIcon />,
        };

        const uniquePriorities = [...new Set(tickets.map((ticket) => ticket.priority))];
        groupedAndSortedTickets = uniquePriorities.map((priority) => {
          return {
            title: (
              <div>
                {priorityIcons[priority] || <CircleIcon />} Priority {priority}
              </div>
            ),
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
      <h1>
        <TuneIcon /> Kanban Board
      </h1>
      <div className="controls">
        <label>
          Group By:
          <select value={groupingOption} onChange={(e) => setGroupingOption(e.target.value)}>
            <option value="status">Status</option>
            <option value="user">User</option>
            <option value="priority">Priority</option>
          </select>
        </label>

        <label>
          Order By:
          <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </label>
      </div>

      <KanbanBoard groupedAndSortedTickets={groupAndSortTickets()} users={users} />
    </div>
  );
}

export default App;
