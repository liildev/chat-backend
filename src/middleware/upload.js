import multer from "multer";
import path from 'path'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(process.cwd(), 'uploads'))
},
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + file.originalname.replace(/\s/g, ''))
    }
  })
  
const upload = multer({ storage: storage })

const file = upload.single('file')
const avatar = upload.single('avatar')

export {
  file,
  avatar
}
