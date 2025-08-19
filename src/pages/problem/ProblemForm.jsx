import React, { useState } from 'react';
import { baseUrl } from '../../services/apiService';

const ProblemForm = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    rewardType: 'coins',
    rewardAmount: '',
    deadline: '',
    tags: ['']
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagChange = (index, value) => {
    const updatedTags = [...form.tags];
    updatedTags[index] = value;
    setForm({ ...form, tags: updatedTags });
  };

  const addTag = () => {
    setForm({ ...form, tags: [...form.tags, ''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('token'); // Your JWT

    try {
      const res = await fetch(`${baseUrl}problem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          rewardAmount: Number(form.rewardAmount),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Problem created successfully!');
        setForm({
          title: '',
          description: '',
          rewardType: 'coins',
          rewardAmount: '',
          deadline: '',
          tags: ['']
        });
      } else {
        setMessage(data.message || 'Error creating problem');
      }
    } catch (error) {
      console.error(error);
      setMessage('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Create Problem</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          style={styles.textarea}
        />

        <select
          name="rewardType"
          value={form.rewardType}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="coins">Coins</option>
          <option value="money">Money</option>
        </select>

        <input
          type="number"
          name="rewardAmount"
          placeholder="Reward Amount"
          value={form.rewardAmount}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="datetime-local"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label>Tags:</label>
        {form.tags.map((tag, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Tag ${index + 1}`}
            value={tag}
            onChange={(e) => handleTagChange(index, e.target.value)}
            style={styles.input}
          />
        ))}
        <button type="button" onClick={addTag} style={styles.button}>
          + Add Tag
        </button>

        <button type="submit" disabled={loading} style={styles.submit}>
          {loading ? 'Submitting...' : 'Create Problem'}
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: { maxWidth: 600, margin: '0 auto', padding: 20 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: { padding: 10, fontSize: 16 },
  textarea: { padding: 10, fontSize: 16, height: 100 },
  button: { padding: 8, background: '#ccc', cursor: 'pointer' },
  submit: {
    padding: 10,
    background: '#4caf50',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default ProblemForm;
