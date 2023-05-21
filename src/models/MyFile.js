import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const MyFileSchema = new Schema({
  fileName: {
    type: String,
    required: [true, 'Filename is a required field.'],
    trim: true,
    maxLength: 100,
    unique: true,
  },
  fileUrl: {
    type: String,
    required: [true, 'File Url is a required field.'],
    trim: true,
    maxLength: 100,
    unique: true,
  },
  isProcessed: {
    type: Boolean,
    default: false,
  },
  vectorIndex: {
    type: String,
    maxLength: 100,
    unique: true,
    required: false,
  },
}, {
  timestamps: true,
});

const MyFileModel = mongoose.models.myFile || mongoose.model('myFile', MyFileSchema);


export default MyFileModel;