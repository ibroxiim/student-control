import { useState } from "react";
import PhotoUpload from "./PhotoUpload";
import { Clock } from "lucide-react";

export default function WorkForm({
  isActive,
  recordedTime,
  onSubmitSuccess,
  onError,
}) {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    photo1: null,
    photo2: null,
    photo3: null,
  });

  const [preview, setPreview] = useState({
    photo1: null,
    photo2: null,
    photo3: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format time for display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return [hours, minutes, remainingSeconds]
      .map((unit) => unit.toString().padStart(2, "0"))
      .join(":");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, name) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));

      // Create preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreview((prev) => ({ ...prev, [name]: fileUrl }));
    }
  };

  const removeFile = (name) => {
    setFormData((prev) => ({ ...prev, [name]: null }));
    setPreview((prev) => ({ ...prev, [name]: null }));

    // Reset the file input
    const fileInput = document.getElementById(name);
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.body || !formData.photo1) {
      onError("Title, body, and at least one photo are required");
      return;
    }

    setIsSubmitting(true);
    const form = new FormData();
    form.append("title", formData.title);
    form.append("body", formData.body);
    form.append("photo1", formData.photo1);
    form.append("recorded_time", recordedTime.toString()); // Add recorded time to form data

    if (formData.photo2) form.append("photo2", formData.photo2);
    if (formData.photo3) form.append("photo3", formData.photo3);

    try {
      // Get token from localStorage or your auth system
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        "https://kuro001.pythonanywhere.com/api/work/work_create/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      if (response.ok) {
        onSubmitSuccess();
        // Reset form
        setFormData({
          title: "",
          body: "",
          photo1: null,
          photo2: null,
          photo3: null,
        });
        setPreview({
          photo1: null,
          photo2: null,
          photo3: null,
        });
      } else {
        const data = await response.json();
        onError(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      onError("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`transition-all duration-500 ${
        isActive ? "opacity-100" : "opacity-40 pointer-events-none"
      }`}
    >
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Submit Your Work
            </h2>

            {/* Display recorded time if available */}
            {recordedTime > 0 && (
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                <Clock className="text-blue-500" size={18} />
                <span className="text-sm text-blue-700">
                  Recorded time:{" "}
                  <span className="font-mono font-medium">
                    {formatTime(recordedTime)}
                  </span>
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter a title for your work"
              />
            </div>

            <div>
              <label
                htmlFor="body"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="body"
                name="body"
                required
                value={formData.body}
                onChange={handleInputChange}
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Describe your work..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PhotoUpload
                name="photo1"
                label="Photo 1"
                required={true}
                preview={preview.photo1}
                onFileChange={handleFileChange}
                onRemove={removeFile}
              />

              <PhotoUpload
                name="photo2"
                label="Photo 2 (Optional)"
                preview={preview.photo2}
                onFileChange={handleFileChange}
                onRemove={removeFile}
              />

              <PhotoUpload
                name="photo3"
                label="Photo 3 (Optional)"
                preview={preview.photo3}
                onFileChange={handleFileChange}
                onRemove={removeFile}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !isActive}
                className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium text-white shadow-md 
                  ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : isActive
                      ? "bg-blue-600 hover:bg-blue-700 transition-colors"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Work"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
