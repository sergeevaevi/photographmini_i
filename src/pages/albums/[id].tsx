import styles from "../../styles/Home.module.scss";
import axios from "axios";
import { GetStaticProps } from "next";
import { TAlbum, TPhoto } from "../../types/containers";
import { PhotoCard } from "../../components/PhotoCard/PhotoCard";

export default function Photos({ photos }: { photos: TPhoto[] }) {
  return (
    <main className={styles.album}>
      {photos?.length &&
        photos?.map((e: TPhoto, i: number) => <PhotoCard key={i} img={e} />)}
    </main>
  );
}

export async function getStaticPaths() {
  try {
    const res = axios
      .get(
        `https://api.vk.com/method/photos.getAlbums?owner_id=-${process.env.NEXT_PUBLIC_OWNER_ID}&access_token=${process.env.NEXT_PUBLIC_ACCESS_TOKEN}&v=${process.env.NEXT_PUBLIC_VK_VERSION}`
      )
      .then((res) => res.data);
    const albums: TAlbum[] = await res.then((res) => res.response?.items);
    const paths = albums?.map((album) => ({
      params: { id: album?.id?.toString() },
    }));
    return { paths, fallback: false };
  } catch {
    return { paths: [], fallback: false };
  }
}

export const getStaticProps: GetStaticProps<{ photos: TPhoto[] }> = async (
  context
) => {
  try {
    const res = axios
      .get(
        `https://api.vk.com/method/photos.get?owner_id=-${process.env.NEXT_PUBLIC_OWNER_ID}&access_token=${process.env.NEXT_PUBLIC_ACCESS_TOKEN}&v=${process.env.NEXT_PUBLIC_VK_VERSION}&album_id=${context.params?.id}`
      )
      .then((res) => res.data);
    const photos: TPhoto[] = await res.then((res) => res.response?.items);
    const allPhotos = JSON.parse(JSON.stringify(photos));
    return { props: { photos: allPhotos }, revalidate: 10 };
  } catch {
    return {
      props: {
        photos: [],
      },
    };
  }
};
