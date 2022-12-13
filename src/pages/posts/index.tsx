import Head from "next/head";
import Image from "next/image";
import styles from './style.module.scss'
import Link from "next/link";

import { GetStaticProps } from "next/types";
import { getPrismicClient } from "../../services/prismic";
import Prismic from '@prismicio/client'
import {asText} from '@prismicio/helpers'

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

import { useState } from "react";

interface Post{
    slug: string | undefined;
    title: string | null;
    description: any;
    cover: any;
    updatedAt: string;
}
interface PostsProps {
    posts: Post[];
    page: string;
    totalPage: string;
}

export default function Posts({posts: blogPosts, page, totalPage}: PostsProps){
    const [currentPage, setCurrentPage] = useState(Number(page))
    const [posts, setPosts] = useState(blogPosts || [])

    async function reqPosts(pageNumber: number){

        const prismic = getPrismicClient()
        const response = await prismic.query([
            Prismic.Predicates.at('document.type', 'post') 
        ],{
            orderings: '[document.last_publication_date desc ]',
            fetch: ['post.title', 'post.description_post','post.cover'],
            pageSize: 3,
            page: String(pageNumber),
        })

        return response

    }
    
    async function navigatePage(pageNumber: number){

        
        const response = await reqPosts(pageNumber)
        try {

            const getPosts = response.results.map( post => {
                return{
                    slug: post.uid,
                    title: asText(post.data.title),
                    description: post.data.description_post.find((content: { type: string; }) => content.type === 'paragraph')?.text?? '',//concertar           
                    cover: post.data.cover.url,
                    updatedAt: new Date(post.last_publication_date+'').toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year:"numeric",
                    }),
                }
            })
            setCurrentPage(pageNumber)
            setPosts(getPosts)
           
            
        } catch (error) {
            return
        }
    }

    return(
        <>
            <Head>
                <title>
                    Blog | Sujeito programador
                </title>
            </Head>
            <main className={styles.container}>
                <div className={styles.posts}>
                   {posts.map(post => (
                    <Link key={post.slug} href={`/posts/${post.slug}`} legacyBehavior>
                     <a key={post.slug}>
                         <Image 
                             src={post.cover} 
                             alt=''
                             width={720}
                             height={410}
                             quality={100}
                             placeholder='blur'
                             blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8cpenHgAGyAJOaI3nMAAAAABJRU5ErkJggg=="
                         />
                     <strong>{post.title}</strong>
                     <time>
                         {post.updatedAt}
                     </time>
                     <p>
                         {post.description}
                     </p>
                     </a>
                    </Link>
                   ))}
                   <div className={styles.buttonNavigate}>

                    { Number(currentPage) >= 2 && (
                        <div>
                            <button onClick={()=> navigatePage(1)}>
                                <FiChevronsLeft size={25} color={'#fff'}></FiChevronsLeft>
                            </button>
                            <button onClick={()=> navigatePage( Number(currentPage)- 1)}>
                                <FiChevronLeft size={25} color={'#fff'}></FiChevronLeft>
                            </button>
                        </div>
                    )}

                    { Number(currentPage) < Number(totalPage) &&(
                        <div>
                            <button onClick={()=> navigatePage(Number(currentPage)+ 1)}>
                                <FiChevronRight size={25} color={'#fff'}></FiChevronRight>
                            </button>
                            <button onClick={()=> navigatePage(Number(totalPage))}>
                                <FiChevronsRight size={25} color={'#fff'}></FiChevronsRight>
                            </button>
                        </div>
                    )}
                   </div>
                </div>

            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () =>{
    const prismic = getPrismicClient()
    const response = await prismic.query([
        Prismic.Predicates.at('document.type', 'post') 
    ], {
        orderings: '[document.last_publication_date desc ]',
        fetch: ['post.title', 'post.description_post','post.cover'],
        pageSize: 3,
    })

    const posts = response.results.map( post => {
        return{
            slug: post.uid,
            title: asText(post.data.title),
            cover: post.data.cover.url,
            description: post.data.description_post.find((content: { type: string; }) => content.type === 'paragraph')?.text?? '',//concertar           
            updatedAt: new Date(post.last_publication_date+'').toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year:"numeric",
            }),//concertar
        }
    })
    const min = 60
   
    return{
        props:{
            posts,
            page: response.page,
            totalPage: response.total_pages,
        },
        revalidate: min * 30
    }
}