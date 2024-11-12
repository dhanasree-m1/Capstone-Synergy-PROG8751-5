import React, { useState } from 'react';

const ImageUpload = ({ label, currentImageUrl, onImageUpload }) => {
  const [preview, setPreview] = useState(currentImageUrl); // Show the current image
  const [tempPreview, setTempPreview] = useState(null); // Temporary preview for new image selection

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Set a temporary preview immediately for visual feedback
      setTempPreview(URL.createObjectURL(file));

      // Prepare FormData for the file upload
      const formData = new FormData();
      formData.append('file', file);

      try {
        // Send the image to the backend
        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        // Update the actual preview and reset the temporary one
        setPreview(data.imageUrl);
        setTempPreview(null);

        // Pass the uploaded image URL to the parent component
        onImageUpload(data.imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div className="form-group">
      <label>{label}</label>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {/* Display tempPreview during upload; fall back to current image otherwise */}
      {tempPreview ? (
        <img src={tempPreview} alt="Temporary Preview" style={{ width: '100px', height: '100px', marginTop: '10px' }} />
      ) : (
        preview && <img src={preview} alt="Preview" style={{ width: '100px', height: '100px', marginTop: '10px' }} />
      )}
    </div>
  );
};

export default ImageUpload;
