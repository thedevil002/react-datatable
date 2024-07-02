import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Graph from '../components/graph.js';

function DataTable() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [pageSearchTerm, setPageSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios('https://jsonplaceholder.typicode.com/todos');
      setData(response.data);
      setFilteredData(response.data);
    };

    fetchData();
  }, []);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else {
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };

  const getSortDirection = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '↑' : '↓';
    }
    return '↕';
  };

  const sortedData = React.useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const currentData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, postsPerPage]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = data.filter(todo =>
      todo.title.toLowerCase().includes(term.toLowerCase()) ||
      todo.id.toString() === term.trim() ||
      todo.completed.toString().includes(term.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); 
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / postsPerPage)) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handlePageSearch = () => {
    const pageNumber = parseInt(pageSearchTerm, 10);
    if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= Math.ceil(filteredData.length / postsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by title, ID, or completed status"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '10px', padding: '8px' }}
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => requestSort('id')}>ID {getSortDirection('id')}</th>
            <th onClick={() => requestSort('title')}>Title {getSortDirection('title')}</th>
            <th onClick={() => requestSort('completed')}>Completed {getSortDirection('completed')}</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.id}</td>
              <td>{todo.title}</td>
              <td>{todo.completed.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
        <button onClick={nextPage} disabled={currentPage >= Math.ceil(filteredData.length / postsPerPage)}>Next</button>
      </div>
      <div style={{ marginTop: '10px' }}>
        <input
          type="text"
          placeholder="Enter page number"
          value={pageSearchTerm}
          onChange={e => setPageSearchTerm(e.target.value)}
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <button onClick={handlePageSearch}>Go</button>
      </div>
      <div style={{ marginTop: '10px' }}>
        Current Page: {currentPage}
      </div>
      <Graph data={filteredData} />
    </div>
  );
}

export default DataTable;
