import { Upload, X } from "lucide-react";

export default function PhotoUpload({
  name,
  label,
  required = false,
  preview,
  onFileChange,
  onRemove,
}) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`border-2 border-dashed rounded-lg ${
          preview ? "border-blue-500 bg-blue-50" : "border-gray-300"
        } p-4 h-40 flex flex-col justify-center items-center cursor-pointer`}
      >
        {preview ? (
          <div className="relative w-full h-full">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded"
            />
            <button
              type="button"
              onClick={() => onRemove(name)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label
            htmlFor={name}
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="text-gray-400 mb-2" size={24} />
            <span className="text-sm text-gray-500">Upload photo</span>
          </label>
        )}
        <input
          type="file"
          id={name}
          name={name}
          required={required}
          onChange={(e) => onFileChange(e, name)}
          className="hidden"
          accept="image/*"
        />
      </div>
    </div>
  );
}
