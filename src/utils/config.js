export const img = {
  yes: require('~images/yes.png'),
  logo: require('~images/logo.png')
}

export default {
  img,
  debug: process.env.NODE_ENV !== 'production'
}
