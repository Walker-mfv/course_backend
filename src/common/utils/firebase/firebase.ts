import { initializeApp, cert } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'

import serviceAccount from './service-account.json'

initializeApp({
  credential: cert(serviceAccount as any),
  storageBucket: 'online-course-a5fe5.appspot.com',
})

export const bucket = getStorage().bucket()
