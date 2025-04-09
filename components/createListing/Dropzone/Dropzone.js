import React from "react";
import { useDropzone } from 'react-dropzone';

const Dropzone = ({ index, onDrop, children }) => {
    const { getRootProps, getInputProps } = useDropzone({
      onDrop: (acceptedFiles) => onDrop(acceptedFiles, index),
      multiple: false,
      accept: 'image/*',
    });
  
    return (
      <div {...getRootProps()} style={{ position: 'relative' }}>
        <input {...getInputProps()} />
        {children}
      </div>
    );
  };
  
  export default Dropzone