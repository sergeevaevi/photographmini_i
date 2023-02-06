import styles from '../styles/Home.module.scss'
import Link from "next/link";
import {GetStaticProps} from "next";
import axios from "axios";
import {TAlbum} from "../types/containers";
import {AlbumCard} from "../components/AlbumCard/AlbumCard";

export default function Albums({albums}: { albums: TAlbum[] }) {
    return (
        <>
            <main className={styles.main}>
                <div className={styles.grid}>
                    Портфолио
                    <div>
                        {albums && (albums).map((e: TAlbum, i: number) => (
                            <Link href={`/albums/${e.id}`} key={i}>
                                <AlbumCard album={e}/>
                            </Link>))
                        }
                    </div>
                </div>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps<{ albums: TAlbum[] }> = async (context) => {
    const res = axios.get(`https://api.vk.com/method/photos.getAlbums?owner_id=-${process.env.NEXT_PUBLIC_OWNER_ID}&access_token=${process.env.NEXT_PUBLIC_ACCESS_TOKEN}&v=${process.env.NEXT_PUBLIC_VK_VERSION}`).then(res => res.data);
    const albums: TAlbum[] = await res.then(res => res.response.items);

    return {
        props: {
            albums,
        },
    }
}