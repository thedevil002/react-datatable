import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Function to fetch posts from JSONPlaceholder
const fetchPosts = async () => {
  const response = await axios('https://jsonplaceholder.typicode.com/posts');
  return response.data;
};

function DataTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPosts().then(setData);
  }, []); // The empty array ensures this effect only runs once

  // Inline styles
  const styles = {
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      backgroundColor: '#f2f2f2',
      border: '1px solid #dddddd',
      textAlign: 'left',
      padding: '8px',
    },
    td: {
      border: '1px solid #dddddd',
      textAlign: 'left',
      padding: '8px',
    }
  };

  // Render a table with posts data
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>ID</th>
          <th style={styles.th}>Title</th>
          <th style={styles.th}>Body</th>
        </tr>
      </thead>
      <tbody>
        {data.map((post) => (
          <tr key={post.id}>
            <td style={styles.td}>{post.id}</td>
            <td style={styles.td}>{post.title}</td>
            <td style={styles.td}>{post.body}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;
