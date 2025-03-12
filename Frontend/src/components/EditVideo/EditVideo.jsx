import React, { useState, useEffect } from "react";
import { useFetchVideo } from "../../hooks/useVideoHooks";

export default function EditVideo({ videoId, onClose }) {
  const { videoData, error } = useFetchVideo(videoId);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    if (videoData) {
      setNewTitle(videoData.title);
      setNewDescription(videoData.description);
    }
  }, [videoData]);

  const handleSave = () => {
    // Handle save action
    onClose();
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-30">
        <div className="bg-darkbg text-lighttext p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Error</h2>
          <p className="mb-4">Failed to load video data.</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-lightbg text-lighttext px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-30">
      <div className="bg-darkbg text-lighttext p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Video</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-3 py-2 bg-lightbg text-lighttext rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full px-3 py-2 bg-lightbg text-lighttext rounded"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-lightbg text-lighttext px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-lighttext px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}