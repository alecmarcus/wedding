import consts from "../../css/consts.css?url";
import fonts from "../../css/fonts.css?url";
import layers from "../../css/layers.css?url";
import resets from "../../css/resets.css?url";
import styles from "../../css/styles.css?url";
import utils from "../../css/utils.css?url";
import vars from "../../css/vars.css?url";

export const Styles = () => {
  return (
    <>
      {/* Order matters */}
      <link rel="stylesheet" href={layers} />
      <link rel="stylesheet" href={vars} />
      <link rel="stylesheet" href={fonts} />
      <link rel="stylesheet" href={consts} />
      <link rel="stylesheet" href={utils} />
      <link rel="stylesheet" href={resets} />
      <link rel="stylesheet" href={styles} />
    </>
  );
};
