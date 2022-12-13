import styles from '../styles/home.module.scss'
import Head from 'next/head'
import Image from 'next/image'

import techsImage from '../../public/images/techs.svg'
//prismic imports
import {asText} from '@prismicio/helpers'
import { GetStaticProps } from 'next'
import Prismic from '@prismicio/client'
import {getPrismicClient} from '../services/prismic'



interface Content{
    title: string,
    subTitle: string,
    linkAction: string,
    mobile: string,
    mobileContent: string,
    mobileBanner: string,
    webTitle: string,
    webContent: string,
    webBanner: string,
}

interface ContentProps{
  content: Content
}

export default function Home({content}: ContentProps) {
  
  return (
    <>
      <Head>
        <title>
          Apaixonado por tecnologia - sujeito programador
        </title>
      </Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section className={styles.actText}>
            <h1>
              {content.title}
            </h1>
            <span>
            {content.subTitle}
            </span>
            <a href={content.linkAction}>
              <button>
                COMEÇAR AGORA!
              </button>
            </a>
          </section>
          <img src="/images/banner-conteudos.png" alt="Conteudos do sujeito programador" />
        </div>
        <hr className={styles.divisor}/>
        <div className={styles.sectionContent}>
          <section className={styles.content}>
            <h2>{content.mobile}</h2>
            <span>
            {content.mobileContent}
            </span>

          </section>
          <img src={content.mobileBanner} alt={content.mobile} />

        </div>
        <hr className={styles.divisor}/>
        <div className={styles.sectionContent}>
          <img src={content.webBanner} alt={content.webTitle} />
          <section className={styles.content}>
            <h2>{content.webTitle}</h2>
            <span>
            {content.webContent}
            </span>

          </section>

        </div>
       

        <div className={styles.nextLevel}>
          <Image src={techsImage} alt='Tecnologias' />
          <h2>
            Mais de <span className={styles.alunos}>15 mil</span> alunos já levaram sua carreira ao próximo nivel.
          </h2>
          <span>
          E você vai perder a chance de evoluir de uma vez por todas?
          </span>
          <a>
            <button>ACESSAR TURMA!</button>
          </a>
        </div>
      
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ()=>{
  //estudar depois
  const prismic = getPrismicClient();
  const response = await prismic.query([
    Prismic.Predicates.at('document.type', 'home')
  ])

  const {
    title, sub_title, link_action,
    mobile, mobile_content, mobile_banner,
    title_web, web_content, web_banner,
  } = response.results[0].data
  //
 
  
  const content = {
    title: asText(title),
    subTitle: asText(sub_title),
    linkAction: link_action.url,
    mobile: asText(mobile),
    mobileContent: asText(mobile_content),
    mobileBanner: mobile_banner.url,
    webTitle: asText(title_web),
    webContent: asText(web_content),
    webBanner: web_banner.url,
  }
  
  return {
    props:{
      content
    },
    revalidate:  60*2
    
  }
}
