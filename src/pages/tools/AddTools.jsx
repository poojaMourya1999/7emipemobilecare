import React, { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { ADD_TOOLS, TOOLS, UPLOAD } from '../../services/apiUrl';
import InputField from '../../components/InputField';

const AddTools = ({ onSuccess, tool , handleTools}) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    photo: '',
    quantity: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // const handleChange = (e) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const uploadImage = async () => {
    setUploading(true);
    if (!imageFile) return '';
    const data = new FormData();
    data.append('file', imageFile);

    try {
      const res = await apiService({
        endpoint: UPLOAD,
        method: 'POST',
        data,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('upload res : ', res?.fileUrl);
      return res?.fileUrl || '';
    } catch (err) {
      console.error('Image upload failed', err);
      return '';
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageUrl = form.photo;

      // Upload only if a new image is selected
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const payload = {
        ...form,
        photo: imageUrl,
      };

      const isEditing = tool && tool._id;

      await apiService({
        endpoint: isEditing ? `${ADD_TOOLS}/${tool._id}` : ADD_TOOLS,
        method: isEditing ? 'PUT' : 'POST',
        data: payload,
      });

      alert(isEditing ? 'Tool updated successfully' : 'Tool added successfully');
      if(isEditing){
        handleTools()
      }
      onSuccess?.();

      if (!isEditing) {
        setForm({
          name: '',
          description: '',
          price: '',
          photo: '',
        });
        setImageFile(null);
      }

    } catch (err) {
      console.error('Error saving tool:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (tool && tool._id) {
      setForm({
        ...tool,
        photo: tool.photo || imageUrl,
      });
    }
  }, [tool]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      <InputField label="Tool Name" name="name" value={form.name} onChange={handleChange} />
      <InputField label="Description" name="description" value={form.description} onChange={handleChange} />
      <div className='flex justify-between'>
        <InputField label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} />
        <InputField label="Price" name="price" type="number" value={form.price} onChange={handleChange} />

      </div>

      {/* File input for actual image */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Upload Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1" />
      </div>

      {imageFile && (
        <button
          type="button"
          onClick={async () => {
            const uploadedUrl = await uploadImage();
            if (uploadedUrl) {
              setForm((prev) => ({ ...prev, photo: uploadedUrl }));
              alert('Image uploaded successfully!');
            }
          }}
          className="mt-2 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
      >
        {loading
          ? (tool && tool._id ? 'Updating...' : 'Submitting...')
          : (tool && tool._id ? 'Update Tool' : 'Add Tool')}
      </button>

    </form>
  );
};

export default AddTools;
