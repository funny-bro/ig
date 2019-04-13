module.exports = {
  ig: {
    user: (userId) => `https://www.instagram.com/${userId}`,
    location: (locationId) => `https://www.instagram.com/explore/locations/${locationId}`,
    shortCode: (shortcode) => `https://www.instagram.com/p/${shortcode}`
  }
}