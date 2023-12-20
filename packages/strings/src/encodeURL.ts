export function encodeURL(url: string) {
  const urlArr = url.split("/");

  const encodeUrl = urlArr.map((item) => {
    return item.endsWith("==") ? encodeURIComponent(item) : item;
  });

  return encodeUrl.join("/");
}
