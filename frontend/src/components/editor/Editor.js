import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Quill from 'quill'
import React from 'react'

const Editor = ({ value, onChange }) => {
  const modules = {
    toolbar: ['bold', 'italic', 'underline']
  };

  const handleChange = (content) => {
    onChange(content);
  };

  return (
    <ReactQuill theme="snow" modules={modules} value={value} onChange={handleChange} />
  );
};

export default Editor;