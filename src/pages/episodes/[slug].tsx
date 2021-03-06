import { GetStaticPaths, GetStaticProps } from "next";
import { api } from "../../services/api";
import {format, parseISO} from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR';
import { convertDuration } from "../../utils/convertDuration";

type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    descriptiom: string,
    members: string;
    duration: number;
    durationAsString: string;
    url: string;
    publishedAt: string;
}

type EpisodeProps = {
    episode: Episode;
}

export default function Episode({episode}: EpisodeProps) {
    return (
        <h1>{episode.title}</h1>
    )
}

export const getStaticPaths: GetStaticPaths = async () =>{
    return {
        paths: [],
        fallback: 'blocking'
    }
}


export const getStaticProps: GetStaticProps = async (ctx) =>{
    const {slug} = ctx.params;
    const {data} = await api.get(`/episodes/${slug}`)

    const episode  = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
          locale:ptBR}),
          duration: Number(data.file.duration),
          durationAsString: convertDuration(Number(data.file.duration)),
          description: data.description,
          url: data.file.url,
    }

    return {
        props: {
            episode,
        },
        revalidate: 60*60*24,
    }
}