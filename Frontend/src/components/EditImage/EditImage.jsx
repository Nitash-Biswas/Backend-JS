import React from "react";
import { MdFileUpload } from "react-icons/md";
import { IoClose } from "react-icons/io5";

const EditImage = ({
  isOpen,
  onClose,
  title,
  imageFile,
  setImageFile,
  onUpdate,
  isAvatar,
  loading,
}) => {
  if (!isOpen) return null;

  // Handle image drop (drag and drop)
  const handleImageDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      setImageFile(files[0]);
    }
  };

  // Handle file input (click to upload)
  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div
        className={`bg-darkbg p-6 rounded-lg ${
          isAvatar ? "w-2/3 md:w-full max-w-md" : "w-2/3 md:w-full max-w-2xl"
        }`}
      >
        <h3 className="text-lighttext text-2xl font-semibold mb-4">
          Edit {title}
        </h3>
        <div
          className={`relative border-4 border-dashed border-darktext ${
            isAvatar ? "w-52 h-52 mx-auto" : "rounded-lg h-64"
          } flex justify-center items-center mb-4 cursor-pointer`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleImageDrop}
          onClick={() =>
            document.getElementById(`${title.toLowerCase()}Input`).click()
          }
        >
          {imageFile ? (
            <>
              <img
                src={URL.createObjectURL(imageFile)}
                alt={`${title} preview`}
                className={`w-full h-full object-cover ${
                  isAvatar ? "" : "rounded-lg"
                }`}
              />
              <button
                className="absolute top-0 right-0 bg-red-500 text-white rounded-lg p-1 m-2 hover:bg-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setImageFile(null);
                }}
              >
                <IoClose size={35} />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center text-darktext">
              <MdFileUpload className="w-12 h-12 mb-2" />
              <p className="text-center">Drag and drop or click to upload</p>
              <p className="text-sm text-center">(Only *.png, *.jpg, *.jpeg images)</p>
            </div>
          )}
        </div>
        <input
          type="file"
          id={`${title.toLowerCase()}Input`}
          hidden
          accept=".png, .jpg, .jpeg"
          onChange={handleFileInput}
        />
        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 bg-gray-600 text-lighttext rounded hover:bg-gray-700 disabled:bg-gray-500"
            onClick={() => {
              onClose();
              setImageFile(null);
            }}
            disabled={loading} // Disable Cancel button when loading
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-lighttext rounded hover:bg-blue-700 disabled:bg-blue-900"
            disabled={!imageFile || loading} // Disable Update button when no file or loading
            onClick={() => {
              onUpdate(imageFile);
            }}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditImage;