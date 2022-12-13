import { GetServerSideProps } from 'next'
import { getPrismicClient } from '../../services/prismic';
import { asText, asHTML } from '@prismicio/helpers'
import Image from 'next/image';
import styles from './post.module.scss'
import Head from 'next/head';

interface PostProps{
    post: { 
        slug: string,
        title: string,
        description: string,
        cover: string,
        updatedAt: string,
    }
}

export default function Post({post}: PostProps){
    
    return(
        <>
            <Head>
                <title>{post.title}</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.containerPost}>
                    <Image 
                        src={post.cover}
                        alt={post.title}
                        width={720}
                        height={410}
                        quality={100}
                        placeholder='blur'
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8cpenHgAGyAJOaI3nMAAAAABJRU5ErkJggg=="
                    />
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div className={styles.descriptionContent} dangerouslySetInnerHTML={{__html: post.description}}></div>
                </article>
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {

    const slug = params?.slug;
    
    const prismic = getPrismicClient(req)

    const response = await prismic.getByUID('post', String(slug) , {});

    if(!response){
        return{
            redirect:{
                destination: '/post',
                permanent: false,
            }
        }
    }

    const post = {
        slug: slug,
        title: asText(response.data.title),
        description: asHTML(response.data.description_post),
        cover: response.data.cover.url,
        updatedAt: new Date(String(response.last_publication_date)).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
    }
  
    return {
        props: {
            post
        }
    }
}