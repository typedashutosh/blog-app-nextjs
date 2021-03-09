import { model, models, Document, Schema } from 'mongoose'

export interface IBlog extends Document {
  title: string
  description: string
  authorID: string
  author: string
  content: string
  mode: 'PUBLIC' | 'PRIVATE'
  state: 'DRAFT' | 'PUBLISHED'
  votes: number
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: false,
      default: ' '
    },
    description: {
      type: String,
      required: false,
      default: ' '
    },
    authorID: {
      type: String,
      required: [true, 'Author ID missing']
    },
    author: {
      type: String,
      required: [true, 'Author name missing']
    },
    content: {
      type: String,
      required: false,
      default: ' '
    },
    mode: {
      type: String,
      required: [true, 'Please specify a mode']
    },
    state: {
      type: String,
      required: [true, 'State is undefined']
    },
    votes: {
      type: Number,
      required: false
    }
  },
  { timestamps: true }
)

export default models.Blog || model<IBlog>('Blog', BlogSchema)
