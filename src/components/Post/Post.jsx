import styles from "./post.module.css";
import avatar from "../../assets/images/avatar.png";
import CoffeeHand from "../../assets/images/CoffeeHand.png";

function Post() {
  return (
    <div className={styles.post}>
      <div className={styles.postWrapper}>
        <div className={styles.postTop}>
          <div className={styles.postTopLeft}>
            <img
              className={styles.postProfileImg}
              src={avatar}
              alt="postProfile"
            />
            <span className={styles.postUsername}>Sarah M.</span>
            <span className={styles.postProgramme}>MSc. Computer Science</span>
            <span className={styles.postDate}> 2h ago</span>
          </div>
        </div>
        <div className={styles.postCenter}>
          <span className={styles.postText}>
            How's our coffee looking today guys!!?? ☕️
          </span>
          <img className={styles.postImg} src={CoffeeHand} alt="postPic" />
        </div>
        <div className={styles.postBottom}>
          <div className={styles.postBottomLeft}>
            {/* Add like, comment buttons here later */}
          </div>
          <div className={styles.postBottomRight}>
            {/* Add action buttons here later */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
