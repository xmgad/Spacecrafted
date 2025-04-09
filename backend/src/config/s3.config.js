import AWS from "aws-sdk"
import multer from "multer"
import multerS3 from "multer-s3"
import dotenv from "dotenv"
dotenv.config() // TODO: already called in server js. resolve error when removed

// Configure AWS SDK
AWS.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
})

const s3 = new AWS.S3()

const imageUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: "public-read",
    metadata: function (req, file, callback) {
      callback(null, { fieldName: file.fieldname })
    },
    key: function (req, file, callback) {
      callback(null, `${Date.now().toString()}-${file.originalname}`)
    },
  }),
  fileFilter: function (_, file, callback) {
    if (file.mimetype.startsWith("image")) {
      // filter for image type only
      callback(null, true)
    } else {
      callback(new Error("Only image files are allowed!"), false)
    }
  },
})

const stageUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_STAGING_BUCKET_NAME,
    acl: "public-read",
    metadata: function (req, file, callback) {
      callback(null, { fieldName: file.fieldname })
    },
    key: function (req, file, callback) {
      callback(null, `${Date.now().toString()}-${file.originalname}`)
    },
  }),
  fileFilter: function (_, file, callback) {
    if (file.mimetype.startsWith("image")) {
      // filter for image type only
      callback(null, true)
    } else {
      callback(new Error("Only image files are allowed!"), false)
    }
  },
})

const deleteImage = (key) => {
  return deleteFromS3(key, process.env.S3_BUCKET_NAME)
}

const deleteStageImage = (key) => {
  return deleteFromS3(key, process.env.S3_STAGING_BUCKET_NAME)
}

const deleteFromS3 = (key, bucket) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucket,
      Key: key,
    }

    s3.deleteObject(params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export { imageUpload, stageUpload, deleteImage, deleteStageImage }
