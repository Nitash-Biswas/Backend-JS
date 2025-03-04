function getPublicId(url) {
  // This regex captures the part after '/upload/' and before the file extension
  const match = url.match(/\/upload\/(?:v\d+\/)?([^.]+)/);
  return match ? match[1] : null;
}

export default getPublicId;
