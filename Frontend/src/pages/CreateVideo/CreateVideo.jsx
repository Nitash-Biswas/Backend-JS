import React, { useRef, useState } from "react";
import { MdFileUpload } from "react-icons/md";
import { usePublishVideo } from "../../hooks/useVideoHooks";
import { useNavigate } from "react-router-dom";

function CreateVideo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [errors, setErrors] = useState({});
  const { publishVideo, loading } = usePublishVideo();
  const [uploadSuccess, setUploadSuccess] = useState(false);
  //   const { createVideo, isLoading, error } = useCreateVideo();

  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const thumbnailRef = useRef(null);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate fields
    const newErrors = {};
    if (!title) newErrors.title = "Title is required";
    if (!video) newErrors.video = "Video is required";
    if (!thumbnail) newErrors.thumbnail = "Thumbnail is required";
    if (!description) newErrors.description = "Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});

    await publishVideo({
      title: title,
      description: description,
      video: video,
      thumbnail: thumbnail,
    });
    setUploadSuccess(true);
    navigate("/");

    // Proceed with form submission
    // console.log("Form submitted with:", {
    //   title,
    //   video,
    //   thumbnail,
    //   description,
    // });
  };

  return (
    <div className="w-full h-full bg-darkbg ">
      <div className="w-full h-full  flex flex-col justify-between p-4">
        <div className=" text-lighttext h-full p-4">
          <h2 className="text-4xl font-semibold mb-8">Create Video</h2>
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-lightbg text-lighttext border border-darktext rounded"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Thumbnail</label>
            <div
              className="t w-96 h-48 border-4 border-darktext text-darktext border-dashed rounded flex justify-center items-center mb-2"
              onDragOver={(e) => {
                e.preventDefault();
                // console.log("Drag over");
              }}
              onDrop={(e) => {
                e.preventDefault();
                // console.log("Drop");
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                  setThumbnail(files[0]);
                }
              }}
            >
              {thumbnail ? (
                <img
                  src={URL.createObjectURL(thumbnail)}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <MdFileUpload size={40} />
                  Upload Thumbnail
                </div>
              )}
            </div>

            <div className="relative">
              <input
                type="file"
                accept=".png, .jpg, .jpeg"
                defaultValue=""
                required
                ref={thumbnailInputRef}
                onChange={(e) => setThumbnail(e.target.files[0])}
                className="w-full px-3 py-2 bg-lightbg text-lighttext border border-darktext cursor-pointer rounded"
              />
              {thumbnail && (
                <button
                  className="absolute text-sm top-1/2 transform -translate-y-1/2 right-1  bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4"
                  onClick={() => {
                    setThumbnail("");
                    thumbnailInputRef.current.value = "";
                    if (thumbnailRef.current) {
                      thumbnailRef.current.src = "";
                    }
                  }}
                >
                  X
                </button>
              )}
            </div>
            <p className="mt-2 text-sm text-darktext">
              Only .png, .jpg, .jpeg files are allowed
            </p>
            {errors.thumbnail && (
              <p className="text-red-500 text-sm mt-1">{errors.thumbnail}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Video</label>
            <div className="relative">
              <input
                type="file"
                accept=".mp4"
                required
                ref={videoInputRef}
                defaultValue=""
                onChange={(e) => {
                  setVideo(e.target.files[0]);
                }}
                className="w-full px-3 py-2 bg-lightbg text-lighttext border border-darktext cursor-pointer rounded"
              />

              {video && (
                <button
                  className="absolute text-sm top-1/2 transform -translate-y-1/2 right-1  bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4"
                  onClick={() => {
                    setVideo(null);
                    videoInputRef.current.value = "";
                  }}
                >
                  X
                </button>
              )}
            </div>
            <p className="mt-2 text-sm text-darktext">
              Only .mp4 files are allowed
            </p>
            {errors.video && (
              <p className="text-red-500 text-sm mt-1">{errors.video}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-lightbg text-lighttext border border-darktext rounded"
              required
            />
          </div>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>
        <div className="flex justify-end p-4 ">
        {uploadSuccess &&
          <p className="text-green-500 text-sm mt-4 mr-8">
            Video uploaded successfully!
          </p>
        }
          <button
            className="bg-lightbg hover:bg-lightbg/70 text-xl text-lighttext px-8 py-2 rounded mr-2 cursor-pointer"
            onClick={() => {
              navigate(-1);
            }}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-xl text-lighttext px-8 py-2 rounded cursor-pointer disabled:bg-blue-900"
            onClick={handleSubmit}
            type="submit"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default CreateVideo;
