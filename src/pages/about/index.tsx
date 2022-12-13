import { GetStaticProps } from "next"
import { getPrismicClient } from "../../services/prismic"
import Prismic from "@prismicio/client"
import { asText, asLink } from "@prismicio/helpers"
import styles from './style.module.scss'
import Image from 'next/image'
import Head from "next/head"
import {FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa'
import techs from '../../../public/images/techs.svg'


interface Content {
    title: string,
    banner: string,
    description: string,
    instagramUrl: string,
    linkedinUrl: string,
    youtubeUrl: string,
}
interface ContentProps{
    content: Content,
}


export default function About({content}: ContentProps){
    console.log(content.title)
    return( 
        <>
            <Head>
                <title>
                    About - Minha empresa
                </title>
            </Head>
            <main className={styles.container}>
                <article className={styles.headerContent} >
                    <section className={styles.textContent}>
                        <h1>{content.title}</h1>
                        <p>
                        {content.description}
                        </p>
                        <div>
                            <a href={content.youtubeUrl}>
                                <FaYoutube size={40} />
                            </a>
                            <a href={content.instagramUrl}>
                                <FaInstagram size={40}/>
                            </a>
                            <a href={content.linkedinUrl}>
                                <FaLinkedin size={40}/>
                            </a>
                            
                        </div>
                    </section>
                    <Image src={content.banner} width={500} height={500} alt='asdqwd'></Image>
                </article>
              
                
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient();
    const response = await prismic.query([
        Prismic.Predicates.at('document.type', 'about')
    ])
    console.log(response.results[0].data)

    const {
        title,
        description,
        banner,
        youtube,
        instagram,
        linkedin,
    } = response.results[0].data
    const content = {
        title: asText(title),
        description: asText(description),
        banner: banner.url,
        youtubeUrl: youtube.url,
        instagramUrl: instagram.url,
        linkedinUrl: linkedin.url,
    }
    console.log(content)

    
    return{
        props:{
            content
        },
        revalidate: 60 * 30
    }
}