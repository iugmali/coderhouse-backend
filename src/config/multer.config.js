import multer from 'multer';

const documentsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/uploads/documents/');
    },
    filename: (req, file, cb) => {
        cb(null, req.params.uid + '-' + file.originalname);
    }
});

export const documentsUpload = multer({ storage: documentsStorage });
