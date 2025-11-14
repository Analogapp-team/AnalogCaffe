import styles from "./share.module.css";
import ProfilePicture from "../../assets/images/ProfilePicture.png";
import image from "../../assets/icons/image.svg";
function Share() {
  return (
    <div className={styles.share}>
      <div className={styles.shareWrapper}>
        <div className={styles.shareTop}>
          <img
            className={styles.shareProfileImg}
            src={ProfilePicture}
            alt="Profile"
          />
          <input
            placeholder="What's in your mind?"
            className={styles.shareInput}
          />
        </div>
        {/* <hr className={styles.shareHr} /> */}
        <div className={styles.shareBottom}>
          <div className={styles.shareOptions}>
            <div className={styles.shareOption}>
              <img className={styles.shareIcon} src={image} alt="image" />
              <span className={styles.shareOptionText}>Add photo</span>
            </div>
          </div>
          <button className={styles.shareButton}>Post</button>
        </div>
      </div>
    </div>
  );
}

export default Share;
