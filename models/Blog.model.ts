import { model, models, Document, Schema } from 'mongoose'

export interface IBlog extends Document {
  title: string
  description: string
  authorID: string
  author: string
  content: string
  mode: 'public' | 'private'
  state: 'draft' | 'published'
  votes: number
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for this blog'],
      default: ' '
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
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
      required: [true, 'Blog cannot be empty'],
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
