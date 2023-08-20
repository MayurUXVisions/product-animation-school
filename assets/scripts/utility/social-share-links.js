export function getShareLinkForSocialMedia(type, url, shareTitle = null, image = null) {
  switch (type) {
  case 'facebook':
    return "https://www.facebook.com/sharer/sharer.php?u=" + url;
  case 'twitter':
    return "https://twitter.com/intent/tweet?url=" + url + "&text=" + shareTitle;
  case 'linkedin':
    return "https://www.linkedin.com/sharing/share-offsite/?url=" + url;
  case 'pinterest':
    return "https://pinterest.com/pin/create/button/?url=" + url + "&media=" + image + "&description=" + shareTitle;
  }

  return false;
}

export function getShareLinkForEmail(emailBody, subject) {
  // Note: '&' need to be converted to '%26'
  emailBody = emailBody.replaceAll('&', '%26');

  return "mailto:?body=" + emailBody + "&subject=" + subject;
}
