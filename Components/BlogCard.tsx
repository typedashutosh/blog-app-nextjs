import { useState, FC, ReactElement, useContext } from 'react'
import {
  Card,
  CardContent,
  CardMedia,
  makeStyles,
  Typography
} from '@material-ui/core'
import Router from 'next/router'
import { Document } from '@contentful/rich-text-types'
import { loadingContext } from '../provider/context'
import { ILoadingContext } from '../provider'
export interface IBlogCard {
  blog: {
    fields: {
      title: string
      description: string
      blogContent: Document
      headerImage: {
        fields: {
          description: string
          file: {
            details: {
              image: {
                height: number
                width: number
              }
            }
            fileName: string
            url: string
          }
        }
      }
    }
    metadata: {
      tags: []
    }
    sys: {
      id: string
      createdAt: string
    }
  }
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    margin: 20,
    cursor: 'pointer'
  },
  media: {
    width: 151
  }
})

const BlogCard: FC<IBlogCard> = ({ blog }): ReactElement => {
  const classes = useStyles()
  const { setLoadingState } = useContext(loadingContext) as ILoadingContext

  return (
    <Card
      className={classes.root}
      onClick={() => {
        setLoadingState(true)
        Router.push(`/resource/${blog.sys.id}`)
      }}
    >
      <CardMedia
        className={classes.media}
        component='img'
        height={151}
        image={blog.fields.headerImage.fields.file.url}
        title={blog.fields.headerImage.fields.description}
        alt={blog.fields.headerImage.fields.description}
      />
      <CardContent>
        <Typography component='h5' variant='h5'>
          {blog.fields.title}
        </Typography>
        <Typography component='summary' variant='subtitle1'>
          {blog.fields.description}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default BlogCard
