export const AVATAR = "/avatar.svg";

// Spread onto <img>: falls back to the anonymous drawing when the photo is empty or fails to load.
export const avatar = (src) => ({
  src: src || AVATAR,
  onError: (e) => {
    if (!e.currentTarget.src.endsWith(AVATAR)) e.currentTarget.src = AVATAR;
  },
});
