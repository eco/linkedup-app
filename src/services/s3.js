import config from '../config'

export default {
  async uploadFile(url, file) {
    const res = await fetch(`${config.contentEndpoint}${url}`, {
      method: 'PUT',
      body: file,
    })
    if (!res.ok) {
      throw new Error('S3 file upload failed')
    }
  },
}
