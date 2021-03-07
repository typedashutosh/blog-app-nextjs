import Head from 'next/head'

const Meta = (props: { title: string }) => {
  return (
    <Head>
      <title>{props.title}</title>
    </Head>
  )
}

export default Meta