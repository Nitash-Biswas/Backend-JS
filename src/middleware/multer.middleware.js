import multer from "multer";

//We're using disk storage because memory storage is too small for files like videos and pdfs.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
});

export {upload}
//cb: callback
//multer() will return storage, which is the full path name of the file