import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/userContext";
import { useFetchSubsciberCount } from "../../hooks/useSubscriptionHooks";
import EditModal from "../../components/EditModal/EditModal";
import {
  useDeleteUser,
  useLogoutUser,
  useUpdateImages,
} from "../../hooks/useUserHooks";
import { IoSettingsSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { loggedUser } = useContext(UserContext);
  const { fetchSubsCount } = useFetchSubsciberCount();
  const {
    updateAvatar,
    updateCoverImage,
    loading: loadingUpdate,
    error: updateError,
  } = useUpdateImages();
  const {
    deleteUser,
    loading: loadingDelete,
    error: deleteError,
  } = useDeleteUser();
  const logoutUser = useLogoutUser();
  const [totalSubs, setTotalSubs] = useState(0);
  const [showCoverEdit, setShowCoverEdit] = useState(false);
  const [showAvatarEdit, setShowAvatarEdit] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [avatarImageFile, setAvatarImageFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubsribersCount = async () => {
      if (loggedUser) {
        const subs = await fetchSubsCount({ username: loggedUser.username });
        setTotalSubs(subs);
      }
    };
    fetchSubsribersCount();
  }, [fetchSubsCount, loggedUser]);

  // Close the modal when loading becomes false
  useEffect(() => {
    if (!loadingUpdate) {
      setShowCoverEdit(false);
      setShowAvatarEdit(false);
    }
  }, [loadingUpdate]);

  // Handle updating cover image
  const handleUpdateCover = async (file) => {
    await updateCoverImage({ coverImage: file });
  };

  // Handle updating avatar
  const handleUpdateAvatar = async (file) => {
    await updateAvatar({ avatar: file });
  };

  const handleDelete = () => {
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    const response = await deleteUser();
    console.log(response);
    logoutUser();
    navigate("/");
    setShowConfirmDelete(false);
  };
  const cancelDelete = () => {
    setShowConfirmDelete(false);
  };

  if (!loggedUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-darkbg flex flex-col text-lighttext min-h-full">
      {/* Cover Image Section */}
      <div className="bg-cover bg-center h-65 flex justify-center items-center relative">
        <img
          src={loggedUser.coverImage || "https://placehold.co/600x400"}
          alt="coverImage"
          className="w-full h-full object-cover"
        />
        <button
          className="absolute bottom-0 right-0 bg-darkbg text-lighttext rounded-full w-12 h-12 m-4 flex justify-center items-center"
          onClick={() => setShowCoverEdit(true)}
        >
          <IoSettingsSharp size={30} />
        </button>
      </div>

      {/* Avatar Section */}
      <div className="flex justify-items-start items-center mb-4 relative w-full">
        <div className="ml-4.5 -mt-16 relative">
          <img
            src={loggedUser.avatar}
            alt="avatarImage"
            className="w-36 h-36 object-cover rounded-full border-4 border-darkbg"
          />
          <button
            className="absolute top-0 right-0 bg-darkbg text-lighttext rounded-full w-12 h-12 flex justify-center items-center"
            onClick={() => setShowAvatarEdit(true)}
          >
            <IoSettingsSharp size={30} />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center justify-between mr-6">
          <div className="ml-4.5">
            <h1 className="text-lighttext text-2xl">{loggedUser.fullname}</h1>
            <p className="text-darktext text-lg">{`@${loggedUser.username}`}</p>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col">
        <div className="text-xl  font-bold mx-4 py-2 rounded">
          <span className="mr-2">Email :</span>
          <span className="text-darktext">{loggedUser.email}</span>
        </div>
        <div className="text-xl  font-bold mx-4 py-2 rounded">
          <span className="mr-2">Joined :</span>
          <span className="text-darktext">
            {new Date(loggedUser.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="text-xl  font-bold mx-4 py-2 rounded">
          <span className="mr-2">Subscribers :</span>
          <span className="text-darktext">{totalSubs}</span>
        </div>
        <div className="text-xl  font-bold mx-4 py-2 rounded">
          <button
            className="text-xl py-2 px-4 font-bold rounded bg-red-500 hover:bg-red-600"
            onClick={handleDelete}
          >
            Delete Account
          </button>
        </div>
      </div>
      {
        // If showConfirmDelete is true, show the delete confirmation box
        showConfirmDelete && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-30">
            <div className="bg-darkbg text-lighttext p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
              <p className="mb-2">
                Are you sure you want to delete your account?
              </p>
              <p className="mb-4 text-darktext text-sm">
                All your data (videos, comments, tweets, likes) will be
                permanently deleted.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={cancelDelete}
                  className="bg-lightbg text-lighttext px-4 py-2 rounded mr-2 hover:bg-lightbg/70"
                >
                  Cancel
                </button>
                <button
                  disabled={loadingDelete}
                  onClick={confirmDelete}
                  className="bg-red-600 text-lighttext px-4 py-2 rounded hover:bg-red-600/70 disabled:bg-red-600/50"
                >
                  {loadingDelete ? "This may take a while..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Edit Modals */}
      <EditModal
        isOpen={showCoverEdit}
        onClose={() => setShowCoverEdit(false)}
        title="Cover Image"
        imageFile={coverImageFile}
        setImageFile={setCoverImageFile}
        onUpdate={handleUpdateCover}
        loading={loadingUpdate}
      />

      <EditModal
        isOpen={showAvatarEdit}
        onClose={() => setShowAvatarEdit(false)}
        title="Avatar"
        imageFile={avatarImageFile}
        setImageFile={setAvatarImageFile}
        onUpdate={handleUpdateAvatar}
        isAvatar={true}
        loading={loadingUpdate}
      />
    </div>
  );
}

export default Profile;
