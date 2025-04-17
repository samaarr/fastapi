import { useState } from 'react';

function App() {
  const [fruits, setFruits] = useState([]);
  const [newFruit, setNewFruit] = useState('');

  // Fetch existing fruits
  const fetchFruits = async () => {
    try {
      const response = await fetch('/api/fruits');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setFruits(data.fruits);
    } catch (error) {
      console.error('Error fetching fruits:', error);
    }
  };

  // Add a new fruit
  const addFruit = async () => {
    try {
      const response = await fetch('/api/fruits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFruit }),
      });
      if (!response.ok) throw new Error('Failed to add fruit');
      setNewFruit('');
      fetchFruits(); // Refresh the list
    } catch (error) {
      console.error('Error adding fruit:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Fruits List</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newFruit}
          onChange={(e) => setNewFruit(e.target.value)}
          placeholder="Enter a fruit"
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button 
          onClick={addFruit}
          style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Add Fruit
        </button>
      </div>
      <button 
        onClick={fetchFruits}
        style={{ padding: '8px 16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', marginBottom: '20px' }}
      >
        Load Fruits
      </button>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {fruits.map((fruit, index) => (
          <li 
            key={index} 
            style={{ padding: '8px', margin: '4px 0', backgroundColor: '#f5f5f5', borderRadius: '4px' }}
          >
            {fruit.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;