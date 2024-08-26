export const decodeOpenIDUrl = (encodedUrl: string): string => {
  // Decode the URL components
  let decodedUrl = decodeURIComponent(encodedUrl);

  // Replace '%2F' with '/'
  decodedUrl = decodedUrl.replace(/%2F/g, "/");

  // Replace '%3A' with ':'
  decodedUrl = decodedUrl.replace(/%3A/g, ":");

  return decodedUrl;
};
