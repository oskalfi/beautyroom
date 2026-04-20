import styles from "./Posts.module.css";

type TPost = {
  id: string;
  media_type: "PHOTO" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url: string;
};

export async function Posts() {
  const response = await fetch(
    `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url&access_token=${process.env.INSTAGRAM_TOKEN}`,
  );
  const { data } = await response.json();
  console.log(data);
  const latestFour = data.slice(0, 4);
  return (
    <div className={styles.imagesWrapper}>
      {latestFour.map((post: TPost) => {
        return (
          <img
            key={post.id}
            className={styles.postImage}
            src={
              post.media_type === "VIDEO" ? post.thumbnail_url : post.media_url
            }
            alt="post from Instagram"
          />
        );
      })}
    </div>
  );
}
