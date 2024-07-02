import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Graph from '../components/graph.js'; 

function DataTable() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(11);
  const [totalPosts, setTotalPosts] = useState(0); 
  const [pageSearchTerm, setPageSearchTerm] = useState('');

  useEffect(() => {
    const fetchTotalPosts = async () => {
      const response = await axios('https://jsonplaceholder.typicode.com/todos');
      setTotalPosts(response.data.length);
    };

    fetchTotalPosts();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const startIndex = (currentPage - 1) * postsPerPage;
      const response = await axios(`https://jsonplaceholder.typicode.com/todos?_start=${startIndex}&_limit=${postsPerPage}&_sort=id&_order=asc`);
      setData(response.data);
    };

    fetchPosts();
  }, [currentPage, postsPerPage]);

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
    let sortableItems = [...data];
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
  }, [data, sortConfig]);

  const filteredData = sortedData.filter(todo =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    todo.id.toString() === searchTerm.trim() ||
    todo.completed.toString().includes(searchTerm.toLowerCase())
  );

  const nextPage = () => {
    if (currentPage < Math.ceil(totalPosts / postsPerPage)) {
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
    if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= Math.ceil(totalPosts / postsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="search by title, id, or completed status"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
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
          {filteredData.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.id}</td>
              <td>{todo.title}</td>
              <td>{todo.completed.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={prevPage} disabled={currentPage === 1}>previous</button>
        <button onClick={nextPage} disabled={currentPage >= Math.ceil(totalPosts / postsPerPage)}>next</button>
      </div>
      <div style={{ marginTop: '10px' }}>
        <input
          type="text"
          placeholder="enter page num"
          value={pageSearchTerm}
          onChange={e => setPageSearchTerm(e.target.value)}
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <button onClick={handlePageSearch}>Go</button>
      </div>
      <div style={{ marginTop: '10px' }}>
        Current Page: {currentPage}
      </div>
      <Graph data={data} />  {}
    </div>
  );
}

export default DataTable;
