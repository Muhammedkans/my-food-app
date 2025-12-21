import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import api, { getBaseURL, getFullImageUrl } from '../../services/api';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, value, onChange, className }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    setError(null);

    try {
      const res = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Just send back what the server returns (could be Cloudinary URL or local path)
      onChange(res.data.data);
    } catch (err) {
      console.error(err);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const previewSrc = getFullImageUrl(value);

  return (
    <div className={className}>
      <label className="block text-gray-400 mb-2 text-sm">{label}</label>

      {value ? (
        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-700 group">
          <img src={previewSrc} alt="Uploaded" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 bg-red-500/80 rounded-full text-white hover:bg-red-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className={`w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors ${error ? 'border-red-500/50 bg-red-500/5' : 'border-gray-700 hover:border-primary/50 hover:bg-gray-800/50'}`}>
            {uploading ? (
              <>
                <Loader2 className="animate-spin text-primary" size={24} />
                <span className="text-gray-400 text-sm">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="text-gray-400" size={24} />
                <span className="text-gray-400 text-sm">Click to upload image</span>
              </>
            )}
          </div>
          {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
