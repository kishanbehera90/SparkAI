import { Scissors, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState('');
  const [object, setObject] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input || !object) {
      return toast.error("Image and object name are required");
    }

    if (object.trim().split(' ').length > 1) {
      return toast.error('Please enter only a single object name');
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('image', input);
      formData.append('object', object);

      const token = await getToken();
      const { data } = await axios.post('/api/ai/remove-image-object', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* Left Column */}
      <form
        onSubmit={onSubmitHandler}
        className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'
      >
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Object Remover</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Upload image</p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type='file'
          accept='image/*'
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600'
          required
        />

        <p className='mt-6 text-sm font-medium'>Describe Object to be removed</p>
        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          rows={4}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='e.g., watch or spoon (only a single object name)'
          required
        />

        <button
          disabled={loading}
          type='submit'
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#41d8f6] to-[#0c19ae] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'
        >
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
          ) : (
            <Scissors className='w-5' />
          )}
          Remove Object
        </button>
      </form>

      {/* Right Column */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3 mb-4'>
          <Scissors className='w-5 h-5 text-[#3f66d3]' />
          <h1 className='text-xl font-semibold'>Processed Image</h1>
        </div>

        {content ? (
          <div className='mt-3 h-full'>
            <img
              src={content}
              alt='Processed Result'
              className='mt-3 w-full h-full object-contain'
            />
          </div>
        ) : (
          <div className='flex-1 flex flex-col justify-center items-center text-sm text-gray-400 gap-5'>
            <Scissors className='w-9 h-9' />
            <p>Upload an image and click "Remove Object" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveObject;
