import { FC, ChangeEvent, ReactElement, useState } from 'react'

interface IuseForm {
  [key: string]: string | undefined
}

export const useForm = (
  initialValues: IuseForm
): [
  typeof initialValues,
  (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
] => {
  const [values, setValues] = useState(initialValues)
  return [
    values,
    (e) => {
      setValues({
        ...values,
        [e.target.id]: e.target.value
      })
    }
  ]
}
