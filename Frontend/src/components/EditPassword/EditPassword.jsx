import React, { useEffect, useState } from "react";
import { useUpdatePassword } from "../../hooks/useUserHooks";

function EditPassword({ onClose }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordMismatchError, setPasswordMismatchError] = useState("");
  const { updatePassword, loading, error } = useUpdatePassword();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Reset password mismatch error
    setPasswordMismatchError("");

    // Validate that new password and confirm new password match
    if (newPassword !== confirmNewPassword) {
      setPasswordMismatchError("New passwords do not match.");
      return;
    }

    // Call the updatePassword function from the hook
    const response = await updatePassword({ oldPassword, newPassword });

    // If the password update is successful, close the modal
    if (response) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-30">
      <div className="bg-darkbg text-lighttext p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Old Password Field */}
          <div className="flex flex-col">
            <label htmlFor="oldPassword" className="text-sm mb-1">
              Old Password
            </label>
            <input
              id="oldPassword"
              type="password"
              value={oldPassword}
              required
              placeholder="Enter your old password"
              onChange={(e) => setOldPassword(e.target.value)}
              className="bg-lightbg text-lighttext px-2 py-1 text-lg rounded"
            />
          </div>

          {/* New Password Field */}
          <div className="flex flex-col">
            <label htmlFor="newPassword" className="text-sm mb-1">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              required
              placeholder="Enter your new password"
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-lightbg text-lighttext px-2 py-1 text-lg rounded"
            />
          </div>

          {/* Confirm New Password Field */}
          <div className="flex flex-col">
            <label htmlFor="confirmNewPassword" className="text-sm mb-1">
              Confirm New Password
            </label>
            <input
              id="confirmNewPassword"
              type="password"
              value={confirmNewPassword}
              required
              placeholder="Confirm your new password"
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="bg-lightbg text-lighttext px-2 py-1 text-lg rounded"
            />
          </div>

          {/* Password Mismatch Error */}
          {passwordMismatchError && (
            <p className="text-red-500 text-sm">{passwordMismatchError}</p>
          )}

          {/* API Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-lightbg text-lighttext px-4 py-2 rounded hover:bg-lightbg/70"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-highlight text-lighttext px-4 py-2 rounded hover:bg-highlight/70 disabled:bg-highlight/50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPassword;
