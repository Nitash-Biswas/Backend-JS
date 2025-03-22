import React, { useState } from "react";
import { MdFileUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useRegisterUser } from "../../hooks/useUserHooks";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null,
    coverImage: null,
  });
  const [errors, setErrors] = useState({});
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const navigate = useNavigate();

  const { registerUser, loading, error } = useRegisterUser();

  const validateFile = (file) => {
    if (!file) return false;
    return ["image/png", "image/jpeg", "image/jpg"].includes(file.type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Basic field validation
    if (!formData.fullName) newErrors.fullName = "Full Name required";
    if (!formData.username) newErrors.username = "Username required";
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email";
    if (formData.password.length < 6)
      newErrors.password = "Password needs 6+ characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords don't match";
    if (!validateFile(formData.avatar))
      newErrors.avatar = "Valid image required";
    if (!validateFile(formData.coverImage))
      newErrors.coverImage = "Valid image required";

    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    // Call the registerUser function
    await registerUser({
      fullname: formData.fullName,
      email: formData.email,
      username: formData.username,
      password: formData.password,
      avatar: formData.avatar,
      coverImage: formData.coverImage,
    });
    setRegisterSuccess(true);
    // console.log("Registration data:", formData);
  };

  const FileUpload = ({ field, label, isAvatar }) => {
    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      handleFileUpload(file, field);
    };

    const handleFileUpload = (file, field) => {
      if (!validateFile(file)) {
        setErrors({ ...errors, [field]: "Only PNG/JPEG images allowed" });
        return;
      }
      setFormData({ ...formData, [field]: file });
      setErrors({ ...errors, [field]: "" });
    };

    const handleRemove = (e) => {
      e.stopPropagation(); // Prevent the click event from bubbling up
      setFormData({ ...formData, [field]: null });
      setErrors({ ...errors, [field]: "" });
    };

    const handleAddImage = () => {
      const fileInput = document.getElementById(`file-input-${field}`);
      fileInput.click();
    };

    return (
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">{label}</label>
        <div
          className={`${
            isAvatar ? "w-48 h-48" : "w-full h-48"
          } flex items-center justify-center
            border-4 border-dashed border-gray-500 rounded cursor-pointer`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleAddImage}
        >
          {formData[field] ? (
            <div className="flex justify-center items-center w-full h-full relative">
              <img
                src={URL.createObjectURL(formData[field])}
                alt={label}
                className="w-full h-full object-cover"
              />
              <button
                className="absolute top-2 right-2 z-50 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleRemove}
              >
                X
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <MdFileUpload className="text-4xl mx-auto" />
              <p>Drag and drop or click to upload</p>
            </div>
          )}
        </div>
        <input
          id={`file-input-${field}`}
          type="file"
          className="hidden"
          accept=".png,.jpg,.jpeg"
          onChange={(e) => handleFileUpload(e.target.files[0], field)}
        />
        {errors[field] && (
          <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-darkbg p-4 text-lighttext">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Create Account</h1>

        <div className="space-y-4">
          <div>
            <input
              placeholder="Full Name"
              className="w-full p-3 bg-lightbg rounded border border-gray-600"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName}</p>
            )}
          </div>

          <div>
            <input
              placeholder="Username"
              className="w-full p-3 bg-lightbg rounded border border-gray-600"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 bg-lightbg rounded border border-gray-600"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password (min. 6 characters)"
              className="w-full p-3 bg-lightbg rounded border border-gray-600"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 bg-lightbg rounded border border-gray-600"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          <FileUpload field="avatar" label="Profile Avatar" isAvatar={true} />
          <FileUpload field="coverImage" label="Cover Image" isAvatar={false} />

          <div className="flex gap-4 justify-end">
            {registerSuccess && !loading && (
              <p className="text-green-500 text-sm mt-4 mr-8">
                User registered successfully, you can now log in!
              </p>
            )}

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-gray-600 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
